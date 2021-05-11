const functions = require("firebase-functions");
const {Telegraf} = require("telegraf");

const bot = new Telegraf(functions.config().telegrambot.key, {
  telegram: {webhookReply: true},
});

// Error handling
bot.catch((err, ctx) => {
  functions.logger.error("[Bot] Error", err)
  return ctx.reply(`Ooop, encountered an error for ${ctx.updateType}`, err)
});

// initialize the commands
bot.command("/start", (ctx) => ctx.reply("Hello! Send any message and I will copy it."));
// copy every message and send to the user
bot.on("message", (ctx) => ctx.telegram.sendCopy(ctx.chat.id, ctx.message));

// Handle all telegram updates with HTTPs trigger
exports.echoBot = functions.https.onRequest(async (req, res) => {
  functions.logger.log("Incoming message", req.body)
  return await bot.handleUpdate(req.body, res).then((rv) => {
    // If it's not a request form the telegram, rv will be undefined, but we should respond with 200
    return !rv && res.sendStatus(200)
  })
});
