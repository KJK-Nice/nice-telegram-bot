const functions = require("firebase-functions");
const {
  Telegraf,
} = require("telegraf");

const bot = new Telegraf(functions.config().telegrambot.key, {
  telegram: {
    webhookReply: true,
  },
});

// Error handling
bot.catch((err, ctx) => {
  functions.logger.error("[Bot] Error", err);
  return ctx.reply(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// Initialize the commands
bot.command("/start", (ctx) => ctx.reply(
    "Hello! Send any message and I will copy it."
));
// Copy every message and send to the user
bot.on("message", (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));

exports.bot = functions.https.onRequest((req, res) => {
  bot.handleUpdate(req.body, res);
});
