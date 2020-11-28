require('dotenv').config()

const fs = require('fs')
const captureWebsite = require('capture-website');
const TelegramBot = require('node-telegram-bot-api')

const token = process.env.BOT_TOKEN;

const bot = new TelegramBot(token, {polling: true});

const parseUrl = (message) => {
  return message.split(' ')[1]
}

const screenWebsite = async (url, fileName) => {
  await captureWebsite.file(url, `screenshots/${fileName}.png`);
}

const removeScreenshot = (fileName) => {
  fs.unlink(`screenshots/${fileName}.png`, (err) => {
    if (err) throw err;
    console.log('File deleted!');
  });
}

bot.on('message', async (msg) => {
  const messageId = msg.message_id
  const chatId = msg.chat.id
  const screenKeyword = 'screen'
  const formatMsg = msg.text.toString().toLowerCase()
  
  if (formatMsg.includes(screenKeyword)) {
    const tagetUrl = parseUrl(formatMsg)
    await screenWebsite(tagetUrl, messageId)
  }

  bot.sendPhoto(chatId, `./screenshots/${messageId}.png`);

  removeScreenshot(messageId)
});
