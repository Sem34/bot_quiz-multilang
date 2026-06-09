const { randomUUID } = require("crypto");
const TelegramBot = require("node-telegram-bot-api");
const values = require("./values.js");
const bot = new TelegramBot(values.bot_token, { polling: true });

// Import question files
const questionsUk = require("./questions/questions_uk.js");
const questionsEn = require("./questions/questions_en.js");
const questionsPl = require("./questions/questions_pl.js");
const questionsRu = require("./questions/questions_ru.js");

// Import result files for different languages
const resultsUk = require("./results/results_uk.js");
const resultsEn = require("./results/results_en.js");
const resultsPl = require("./results/results_pl.js");
const resultsRu = require("./results/results_ru.js");

// State management
const chatState = {};

// Start keyboard with language selection
const startKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "🇺🇦 Українська", callback_data: "lang_uk" },
        { text: "🇬🇧 English", callback_data: "lang_en" },
      ],
      [
        { text: "🇵🇱 Polski", callback_data: "lang_pl" },
        { text: "🇷🇺 Русский", callback_data: "lang_ru" },
      ],
    ],
  },
};

// Create dynamic keyboard for answers
const keyboard = (questionNumber, sessionId) => ({
  inline_keyboard: [
    [
      { text: "✨ A ✨", callback_data: `s:${sessionId}:${questionNumber}1` },
      { text: "✨ B ✨", callback_data: `s:${sessionId}:${questionNumber}2` },
      { text: "✨ C ✨", callback_data: `s:${sessionId}:${questionNumber}3` },
      { text: "✨ D ✨", callback_data: `s:${sessionId}:${questionNumber}4` },
      { text: "✨ E ✨", callback_data: `s:${sessionId}:${questionNumber}5` },
    ],
  ],
});

// Function to display the result
const result = (A, B, C, D, E, chatId, language) => {
  const results =
    language === "uk"
      ? resultsUk
      : language === "en"
      ? resultsEn
      : language === "pl"
      ? resultsPl
      : resultsRu;

  // if draw between several types, priority to E, then A, B, C, D
  const scores = { A, B, C, D, E };
  const maxScore = Math.max(A, B, C, D, E);
  const leaders = Object.entries(scores)
    .filter(([k, v]) => v === maxScore)
    .map(([k]) => k);

  let finalKey;
  if (leaders.includes("E")) {
    finalKey = "E";
  } else {
    // regular priority A, B, C, D
    const order = ["A", "B", "C", "D"];
    finalKey = order.find((k) => leaders.includes(k));
  }

  // 1) Send link to the most prominent type (HTML)
  if (finalKey && results.links && results.links[finalKey]) {
    bot.sendMessage(chatId, results.links[finalKey], {
      parse_mode: "HTML",
      disable_web_page_preview: false,
    });
  }

  // 2) The detailed result (Markdown)
  if (typeof results.resultMessage === "function") {
    bot.sendMessage(chatId, results.resultMessage(A, B, C, D, E), {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    });

    bot.sendMessage(values.logger_id, results.resultMessage(A, B, C, D));
  }
};

// Main bot logic
const botLogic = async () => {
  bot.setMyCommands([{ command: "/start", description: "Restart the test" }]);

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;

    if (msg.text === "/start") {
      chatState[chatId] = {
        inProgress: false,
        currentQuestion: 0,
        sessionId: null,
        lastMessageId: null,
        language: "",
        scores: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      };
      const startMessage = `🇺🇦 Привіт! Виберіть мову:
🇬🇧 Hello! Choose a language:
🇵🇱 Cześć! Wybierz język:
🇷🇺 Привет! Выберите язык:`;
      bot.sendMessage(chatId, startMessage, startKeyboard);
    }
  });

  bot.on("callback_query", async (query) => {
    const action = query.data;
    const chatId = query.message.chat.id;
    console.log(`Action received: ${action}`); // Debugging output

    if (action.startsWith("lang_") && chatState[chatId]?.inProgress) {
      await bot
        .answerCallbackQuery(query.id, {
          text: "Завершіть тест або натисніть /start.",
        })
        .catch(() => {});
      return;
    }

    // Handle language selection
    else if (action.startsWith("lang_")) {
      const chosenLanguage = action.split("_")[1];
      chatState[chatId] = chatState[chatId] || {};
      chatState[chatId].inProgress = false;
      chatState[chatId].currentQuestion = 0;
      chatState[chatId].sessionId = null;
      chatState[chatId].lastMessageId = null;
      chatState[chatId].language = chosenLanguage;
      chatState[chatId].scores = { A: 0, B: 0, C: 0, D: 0, E: 0 };

      const startMessage =
        chosenLanguage === "uk"
          ? questionsUk.start
          : chosenLanguage === "en"
          ? questionsEn.start
          : chosenLanguage === "pl"
          ? questionsPl.start
          : questionsRu.start;

      const startButtonText = {
        uk: "✨ Розпочати тест ✨",
        en: "✨ Start Test ✨",
        pl: "✨ Rozpocznij test ✨",
        ru: "✨ Начать тест ✨",
      };

      try {
        await bot.sendMessage(chatId, startMessage, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: startButtonText[chosenLanguage],
                  callback_data: `test_start_${chosenLanguage}`,
                },
              ],
            ],
          },
          parse_mode: "Markdown",
        });
        await bot.answerCallbackQuery(query.id).catch(() => {});
      } catch (error) {
        console.error("Send error:", error.message);
      }
      return; // Exit to prevent further processing
    }

    // Handle test start
    if (action.startsWith("test_start")) {
      const language = chatState[chatId]?.language || "uk";
      chatState[chatId] = {
        inProgress: false,
        currentQuestion: 0,
        sessionId: null,
        lastMessageId: null,
        language: "",
        scores: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      };
      chatState[chatId].currentQuestion = 1;

      const sessionId = randomUUID();
      chatState[chatId].inProgress = true;
      chatState[chatId].sessionId = sessionId;
      chatState[chatId].lastMessageId = null;

      const question =
        language === "uk"
          ? questionsUk.first
          : language === "en"
          ? questionsEn.first
          : language === "pl"
          ? questionsPl.first
          : questionsRu.first;

      try {
        const sent = await bot.sendMessage(chatId, question, {
          reply_markup: keyboard(chatState[chatId].currentQuestion, sessionId),
          parse_mode: "Markdown",
        });
        chatState[chatId].lastMessageId = sent.message_id;
        await bot.answerCallbackQuery(query.id).catch(() => {});
      } catch (error) {
        console.error("Send error:", error.message);
      }

      return;
    }

    // Handle answers
    if (action.startsWith("s:")) {
      const parts = action.split(":");
      if (parts.length < 3) {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        return;
      }
      const [, sessionId, payload] = parts;
      if (!/^\d+$/.test(payload)) {
        await bot.answerCallbackQuery(query.id).catch(() => {});
        return;
      }
      const st = chatState[chatId];

      // if no active session or sessionId mismatch
      if (!st?.inProgress || st.sessionId !== sessionId) {
        await bot
          .answerCallbackQuery(query.id, { text: "Це старе повідомлення." })
          .catch(() => {});
        return;
      }

      const questionNumber = Math.floor(parseInt(payload, 10) / 10);
      const option = parseInt(payload.charAt(payload.length - 1), 10);

      // only current question allowed
      if (questionNumber !== st.currentQuestion || isNaN(option)) {
        await bot
          .answerCallbackQuery(query.id, { text: "Це старе повідомлення." })
          .catch(() => {});
        return;
      }

      // disable old buttons
      if (st.lastMessageId) {
        bot
          .editMessageReplyMarkup(
            { inline_keyboard: [] },
            { chat_id: chatId, message_id: st.lastMessageId }
          )
          .catch(() => {});
      }

      // count answer
      if (option === 1) st.scores.A++;
      else if (option === 2) st.scores.B++;
      else if (option === 3) st.scores.C++;
      else if (option === 4) st.scores.D++;
      else if (option === 5) st.scores.E++;

      // next question or finish
      if (st.currentQuestion < 13) {
        st.currentQuestion++;
        const language = st.language || "uk";
        const questions =
          language === "uk"
            ? questionsUk
            : language === "en"
            ? questionsEn
            : language === "pl"
            ? questionsPl
            : questionsRu;

        const keys = [
          "first",
          "second",
          "third",
          "fourth",
          "fifth",
          "sixth",
          "seventh",
          "eighth",
          "ninth",
          "tenth",
          "eleventh",
          "twelfth",
          "thirteenth",
        ];
        const nextQuestion = questions[keys[st.currentQuestion - 1]];

        try {
          const sent = await bot.sendMessage(chatId, nextQuestion, {
            reply_markup: keyboard(st.currentQuestion, st.sessionId),
            parse_mode: "Markdown",
          });
          st.lastMessageId = sent.message_id;
        } catch (error) {
          console.error("Send error:", error.message);
        }
      } else {
        // final
        const lang = st.language || "uk";
        const { A, B, C, D, E } = st.scores;
        try {
          result(A, B, C, D, E, chatId, lang);
        } catch (error) {
          console.error("Result send error:", error.message);
        }

        // reset state
        chatState[chatId].inProgress = false;
        chatState[chatId].currentQuestion = 0;
        chatState[chatId].sessionId = null;

        // deactivate buttons on last question
        if (st.lastMessageId) {
          bot
            .editMessageReplyMarkup(
              { inline_keyboard: [] },
              { chat_id: chatId, message_id: st.lastMessageId }
            )
            .catch(() => {});
        }
      }

      await bot.answerCallbackQuery(query.id).catch(() => {});
      return;
    }
    await bot.answerCallbackQuery(query.id).catch(() => {});
  });
};

botLogic();

module.exports = {
  bot,
};
