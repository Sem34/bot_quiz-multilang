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
  return [
    { text: '✨ A ✨', callback_data: `${questionsNumber}1` },
    { text: '✨ B ✨', callback_data: `${questionsNumber}2` },
    { text: '✨ C ✨', callback_data: `${questionsNumber}3` },
    { text: '✨ D ✨', callback_data: `${questionsNumber}4` }
  ];
};

// Function to display the result
const result = (A, B, C, D, chatId, language) => {
  if (!chatId) {
    console.error('chat_id is empty in result function');
    return;
  }

  // Select results based on the language
  const results = language === 'uk' ? resultsUk
               : language === 'en' ? resultsEn
               : language === 'pl' ? resultsPl
               : resultsRu;

  // Send result message
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

// Main bot logic
const botLogic = async () => {
  bot.setMyCommands([{ command: '/start', description: 'Restart the test' }]);

  let A = 0, B = 0, C = 0, D = 0;
  let currentLanguage = ''; // To track the current language
  
  // Handle messages
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/start') {
      bot.sendMessage(chatId, 'Choose a language:', startKeyboard);
    }
  });
  
  // Handle callback queries (button clicks)
  bot.on('callback_query', async (query) => {
    const action = query.data;
    const chatId = query.message.chat.id;

    // Handle language selection
    if (action === 'lang_uk') {
      A = B = C = D = 0; // Reset counters
      currentLanguage = 'uk'; // Set language
      bot.sendMessage(chatId, questionsUk.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Почати тест ✨', callback_data: 'test_start_uk' }]] },
        parse_mode: 'Markdown'
      });
    } else if (action === 'lang_en') {
      A = B = C = D = 0;
      currentLanguage = 'en';
      bot.sendMessage(chatId, questionsEn.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Start Test ✨', callback_data: 'test_start_en' }]] },
        parse_mode: 'Markdown'
      });
    } else if (action === 'lang_pl') {
      A = B = C = D = 0;
      currentLanguage = 'pl';
      bot.sendMessage(chatId, questionsPl.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Rozpocznij test ✨', callback_data: 'test_start_pl' }]] },
        parse_mode: 'Markdown'
      });
    } else if (action === 'lang_ru') {
      A = B = C = D = 0;
      currentLanguage = 'ru';
      bot.sendMessage(chatId, questionsRu.start, {
        reply_markup: { inline_keyboard: [[{ text: '✨ Начать тест ✨', callback_data: 'test_start_ru' }]] },
        parse_mode: 'Markdown'
      });
    }

    // Handle test start
    if (action.startsWith('test_start')) {
      const question = currentLanguage === 'uk' ? questionsUk.first
                      : currentLanguage === 'en' ? questionsEn.first
                      : currentLanguage === 'pl' ? questionsPl.first
                      : questionsRu.first;

      bot.sendMessage(chatId, question, {
        reply_markup: { inline_keyboard: [keyboard(1)] },
        parse_mode: 'Markdown'
      });
    }

    // Handle answers
    const questionNumber = parseInt(action.charAt(0));
    const option = parseInt(action.charAt(1));

    if (questionNumber === 1) {
      // Update counters based on the selected answer
      if (option === 1) A++;
      else if (option === 2) B++;
      else if (option === 3) C++;
      else if (option === 4) D++;

      // Send the second question
      const nextQuestion = currentLanguage === 'uk' ? questionsUk.second
                          : currentLanguage === 'en' ? questionsEn.second
                          : currentLanguage === 'pl' ? questionsPl.second
                          : questionsRu.second;
      
      bot.sendMessage(chatId, nextQuestion, {
        reply_markup: { inline_keyboard: [keyboard(2)] },
        parse_mode: 'Markdown'
      });
    } else if (questionNumber === 2) {
      // Update counters for the second question
      if (option === 1) A++;
      else if (option === 2) B++;
      else if (option === 3) C++;
      else if (option === 4) D++;

      // Show the result
      result(A, B, C, D, chatId, currentLanguage);
    }
  });
};

botLogic();
