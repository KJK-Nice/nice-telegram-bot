const functions = require("firebase-functions");
const {
  Telegraf,
} = require("telegraf");

const {
  getCryptoQuote,
} = require("./services/cmc.js");

const {
  quoteTemplate,
  quoteDetailsTemplate,
  priceTemplate,
} = require("./src/templates.js");

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
    `WELCOME TO THE MANUAL OF TELEGRAM NICE TEST BOT
    /p   <SYMBOL> for get coin price (USD)
    /q   <SYMBOL> for get quote summary.
    /qd   <SYMBOL> for get quote details.`
));

// Get quote
bot.hears(/^\/p[ =](.+)$/, async (ctx) => {
  const symbol = ctx.match[1];
  try {
    const response = await getCryptoQuote(symbol);
    functions.logger.log(response);
    ctx.reply(
        priceTemplate(symbol, response.usd, response.name, response.rank)
    );
  } catch (error) {
    functions.logger.error(error);
    ctx.reply(`Sorry bros. I can not get ${symbol}: ${error}`);
  }
});

// Get quote
bot.hears(/^\/q[ =](.+)$/, async (ctx) => {
  const symbol = ctx.match[1];
  try {
    const response = await getCryptoQuote(symbol);
    functions.logger.log(response);
    ctx.reply(
        quoteTemplate(symbol, response.usd, response.name, response.rank)
    );
  } catch (error) {
    functions.logger.error(error);
    ctx.reply(`Sorry bros. I can not get ${symbol}: ${error}`);
  }
});

// Get quote detail
bot.hears(/^\/qd[ =](.+)$/, async (ctx) => {
  const symbol = ctx.match[1];
  try {
    const response = await getCryptoQuote(symbol);
    functions.logger.log("Incoming data:", response);
    const payload = {
      symbol: response.symbol || symbol,
      quote: response.usd,
      rank: response.rank,
      name: response.name,
      tags: response.tags.join(", "),
      circulatingSupply: response.circulatingSupply,
      totalSupply: response.totalSupply,
    };
    const result = quoteDetailsTemplate(payload);
    ctx.reply(result);
  } catch (error) {
    functions.logger.error(error);
    ctx.reply(`Sorry bros. I can not get ${symbol}: ${error}`);
  }
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

exports.bot = functions.https.onRequest(async (req, res) => {
  functions.logger.log("Incoming message", req.body);
  return await bot.handleUpdate(req.body, res).then((rv) => {
    return !rv && res.sendStatus(200);
  });
});
