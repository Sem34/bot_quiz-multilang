const TelegramBot = require('node-telegram-bot-api');
const values = require('./values.js');
const bot = new TelegramBot(values.bot_token, { polling: true });

// Import question files
const questionsUk = require('./questions/questions_uk.js');
const questionsEn = require('./questions/questions_en.js');
const questionsPl = require('./questions/questions_pl.js');
const questionsRu = require('./questions/questions_ru.js');

// Import result files for different languages
const resultsUk = require('./results/results_uk.js');
const resultsEn = require('./results/results_en.js');
const resultsPl = require('./results/results_pl.js');
const resultsRu = require('./results/results_ru.js');

// Start keyboard with language selection
const startKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: '🇺🇦 Українська', callback_data: 'lang_uk' },
        { text: '🇬🇧 English', callback_data: 'lang_en' }
      ],
      [
        { text: '🇵🇱 Polski', callback_data: 'lang_pl' },
        { text: '🇷🇺 Русский', callback_data: 'lang_ru' }
      ]
    ]
  }
};

// Create dynamic keyboard for answers
const keyboard = (questionsNumber) => {
  return {
    inline_keyboard: [
      [
        { text: '✨ A ✨', callback_data: `${questionsNumber}1` },
        { text: '✨ B ✨', callback_data: `${questionsNumber}2` },
        { text: '✨ C ✨', callback_data: `${questionsNumber}3` },
        { text: '✨ D ✨', callback_data: `${questionsNumber}4` },
        { text: '✨ E ✨', callback_data: `${questionsNumber}5` }
      ]
    ]
  };
};

// Function to display the result
const result = (A, B, C, D, Ecount, chatId, language) => {
  const results = language === 'uk' ? resultsUk
               : language === 'en' ? resultsEn
               : language === 'pl' ? resultsPl
               : resultsRu;

  // Отправляем сообщение с результатами
  bot.sendMessage(chatId, results.resultMessage(A, B, C, D, Ecount), { parse_mode: 'Markdown' });

  // if 'E' answers are majority or tie situation, send balanced message
  if (results.links && results.links.E) {
    const scores = [A, B, C, D];
    const maxScore = Math.max(...scores);
    const leaders = scores.filter(s => s === maxScore).length;

    const majorityE = Ecount >= 7;        // 7+ з 13 відповідей — явно баланс
    const tieAD = maxScore === 0 || leaders > 1; // нічия або взагалі нуль

    if (majorityE || tieAD) {
      bot.sendMessage(chatId, results.links.E, { parse_mode: 'Markdown' });
      return;
    }
  }

  const maxScore = Math.max(A, B, C, D); // Находим максимальный балл

  // Проверяем, какой тип наибольший и отправляем соответствующую ссылку
  if (maxScore === A) {
    bot.sendMessage(chatId, results.links.A, { parse_mode: 'HTML' });
  } else if (maxScore === B) {
    bot.sendMessage(chatId, results.links.B, { parse_mode: 'HTML' });
  } else if (maxScore === C) {
    bot.sendMessage(chatId, results.links.C, { parse_mode: 'HTML' });
  } else if (maxScore === D) {
    bot.sendMessage(chatId, results.links.D, { parse_mode: 'HTML' });
  }
};

// Main bot logic
const botLogic = async () => {
  bot.setMyCommands([{ command: '/start', description: 'Restart the test' }]);

  let A = 0, B = 0, C = 0, D = 0, Ecount = 0;
  let currentLanguage = '';
  let currentQuestion = 0; // Start from 0

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
      const startMessage = `🇺🇦 Привіт! Виберіть мову:
🇬🇧 Hello! Choose a language:
🇵🇱 Cześć! Wybierz język:
🇷🇺 Привет! Выберите язык:`;
      bot.sendMessage(chatId, startMessage, startKeyboard);
    }
  });
  
  bot.on('callback_query', async (query) => {
    const action = query.data;
    console.log(`Action received: ${action}`); // Debugging output
    const chatId = query.message.chat.id;

    // Handle language selection
    if (action.startsWith('lang_')) {
      A = B = C = D = Ecount = 0; // Reset counters
      currentLanguage = action.split('_')[1]; // Set language
      currentQuestion = 0; // Reset current question

      const startMessage = currentLanguage === 'uk' ? questionsUk.start :
                           currentLanguage === 'en' ? questionsEn.start :
                           currentLanguage === 'pl' ? questionsPl.start :
                           questionsRu.start;

      const startButtonText = {
        uk: '✨ Розпочати тест ✨',
        en: '✨ Start Test ✨',
        pl: '✨ Rozpocznij test ✨',
        ru: '✨ Начать тест ✨'
      };
                        
      bot.sendMessage(chatId, startMessage, {
        reply_markup: { inline_keyboard: [[{ text: startButtonText[currentLanguage], callback_data: `test_start_${currentLanguage}` }]] },
        parse_mode: 'Markdown'
      });
      return; // Exit to prevent further processing
    }

    // Handle test start
    if (action.startsWith('test_start')) {
      currentQuestion = 1; // Start from the first question
      const question = currentLanguage === 'uk' ? questionsUk.first :
                       currentLanguage === 'en' ? questionsEn.first :
                       currentLanguage === 'pl' ? questionsPl.first :
                       questionsRu.first;

      bot.sendMessage(chatId, question, {
        reply_markup: keyboard(currentQuestion),
        parse_mode: 'Markdown'
      });
      return; // Exit to prevent further processing
    }

    // Handle answers
const questionNumber = Math.floor(parseInt(action) / 10); // Получаем номер вопроса
const option = parseInt(action.charAt(action.length - 1)); // Получаем выбранный вариант

if (!isNaN(option)) {
  console.log(`Option selected: ${option}`); // Debugging output

  // Update counters based on selected answer
  if (option === 1) {
    A++;
    console.log(`A count: ${A}`); // Debugging output
  } else if (option === 2) {
    B++;
    console.log(`B count: ${B}`); // Debugging output
  } else if (option === 3) {
    C++;
    console.log(`C count: ${C}`); // Debugging output
  } else if (option === 4) {
    D++;
    console.log(`D count: ${D}`); // Debugging output
  } else if (option === 5) {
    Ecount++;
    console.log(`E count: ${Ecount}`); // Debugging output
  }

      // Check if we should show the next question
      if (currentQuestion < 13) {
        const questions = currentLanguage === 'uk' ? questionsUk :
                          currentLanguage === 'en' ? questionsEn :
                          currentLanguage === 'pl' ? questionsPl :
                          questionsRu;

        currentQuestion++; // Increment before getting the next question
        const nextQuestionKey = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth'][currentQuestion - 1];

        const nextQuestion = questions[nextQuestionKey];

        if (nextQuestion) {
          bot.sendMessage(chatId, nextQuestion, {
            reply_markup: keyboard(currentQuestion),
            parse_mode: 'Markdown'
          });
        }
      } else {
        // Show results if all questions are answered
        result(A, B, C, D, Ecount, chatId, currentLanguage);
        currentQuestion = 0; // Reset for the next survey
      }
    } else {
      console.error(`Unexpected option: ${option}`);
    }
  });
};

botLogic();