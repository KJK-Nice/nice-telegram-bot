const functions = require("firebase-functions");
const {
  Telegraf,
} = require("telegraf");

const {
	getCryptoQuote
} = require("./services/cmc.js")

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

bot.command("/help", (ctx) => ctx.reply(
`
WELCOME TO THE MANUAL OF TELEGRAM NICE TEST BOT
/p   <SYMBOL> for get coin price (USD)
/q   <SYMBOL> for get quote summary.
/qd   <SYMBOL> for get quote details.
`
));

// Copy every message and send to the user
bot.on("message", (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));

exports.bot = functions.https.onRequest(async (req, res) => {
  functions.logger.log("Incoming message", req.body);
  const update = await bot.handleUpdate(req.body, res).then((rv) => {
    return !rv && res.sendStatus(200);
  });
  return update;
});
