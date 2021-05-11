const functions = require("firebase-functions");
const {Telegraf} = require("telegraf");

const bot = new Telegraf(functions.config().telegrambot.key);

bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();

exports.bot = functions.https.onRequest((req, res) => {
  bot.handleUpdate(req.body, res);
});
