const TelegramBot = require('node-telegram-bot-api');
const values = require('./values.js');
const bot = new TelegramBot(values.bot_token, { polling: true });

// Import files with questions
const questionsUk = require('./questions_uk.js');
const questionsEn = require('./questions_en.js');

// Import results for different languages
const resultsUk = require('./results_uk.js');
const resultsEn = require('./results_en.js');

const startKeyboard = {
  reply_markup: {
    keyboard: [
      [
        { text: '🇺🇦 Українська' },
        { text: '🇬🇧 English' }
      ]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  }
};

const keyboard = (questionsNumber) => {
  return [
    { text: '✨ A ✨', callback_data: `${questionsNumber}1` },
    { text: '✨ B ✨', callback_data: `${questionsNumber}2` },
    { text: '✨ C ✨', callback_data: `${questionsNumber}3` },
    { text: '✨ D ✨', callback_data: `${questionsNumber}4` }
  ];
};

const result = (A, B, C, D, chatId, language) => {
  if (!chatId) {
    console.error('chat_id is empty in result function');
    return;
  }

  const results = language === 'uk' ? resultsUk : resultsEn;

  bot.sendMessage(chatId, results.resultMessage(A, B, C, D), { parse_mode: 'Markdown' });

  const number = Math.max(A, B, C, D);
  switch (number) {
    case A:
      bot.sendMessage(chatId, results.links.A, { parse_mode: 'HTML' });
      break;
    case B:
      bot.sendMessage(chatId, results.links.B, { parse_mode: 'HTML' });
      break;
    case C:
      bot.sendMessage(chatId, results.links.C, { parse_mode: 'HTML' });
      break;
    case D:
      bot.sendMessage(chatId, results.links.D, { parse_mode: 'HTML' });
      break;
  }
};

const botLogic = async () => {
  bot.setMyCommands([{ command: '/start', description: 'Пройти тест ще раз' }]);

  let A = 0, B = 0, C = 0, D = 0;
  let currentLanguage = ''; // Variable for tracking language

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
      bot.sendMessage(chatId, 'Оберіть мову:', startKeyboard);
    } else if (msg.text === '🇺🇦 Українська') {
      A = B = C = D = 0; // reset the counters
      currentLanguage = 'uk'; // Set the language
      bot.sendMessage(chatId, questionsUk.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Почати тест ✨', callback_data: 'test_start_uk' }]] },
        parse_mode: 'Markdown'
      });
    } else if (msg.text === '🇬🇧 English') {
      A = B = C = D = 0; // reset the counters
      currentLanguage = 'en'; // Set the language
      bot.sendMessage(chatId, questionsEn.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Start Test ✨', callback_data: 'test_start_en' }]] },
        parse_mode: 'Markdown'
      });
    }
  });

  bot.on('callback_query', async (query) => {
    const action = query.data;
    const chatId = query.message.chat.id;

    // Logic to start the test
    if (action === 'test_start_uk') {
      bot.sendMessage(chatId, questionsUk.first, {
        reply_markup: { inline_keyboard: [keyboard(1)] },
        parse_mode: 'Markdown'
      });
    } else if (action === 'test_start_en') {
      bot.sendMessage(chatId, questionsEn.first, {
        reply_markup: { inline_keyboard: [keyboard(1)] },
        parse_mode: 'Markdown'
      });
    }

    // Processing questions
    const questionNumber = parseInt(action.charAt(0));
    const option = parseInt(action.charAt(1));

    if (questionNumber === 1) {
      // Increase the counter depending on the selected option
      if (option === 1) A++;
      else if (option === 2) B++;
      else if (option === 3) C++;
      else if (option === 4) D++;

      // Moving on to the second question
      const nextQuestion = currentLanguage === 'uk' ? questionsUk.second : questionsEn.second;
      bot.sendMessage(chatId, nextQuestion, {
        reply_markup: { inline_keyboard: [keyboard(2)] },
        parse_mode: 'Markdown'
      });
    } else if (questionNumber === 2) {
      //Increase the counter for the second question
      if (option === 1) A++;
      else if (option === 2) B++;
      else if (option === 3) C++;
      else if (option === 4) D++;

      // Call the result
      result(A, B, C, D, chatId, currentLanguage);
    }
  });
};

botLogic();
