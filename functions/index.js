const functions = require("firebase-functions");
const {
  Telegraf,
} = require("telegraf");

const {
  getCryptoQuote,
} = require("./services/cmc.js");

const {
  getSimplePrice,
  getTrending,
} = require("./services/coingecko.js");

const {chatCompletion} = require("./services/openai.js");

const {
  quoteTemplate,
  quoteDetailsTemplate,
  priceTemplate,
  trendingTemplate,
} = require("./src/templates.js");

const BOT_COMMANDS = [
  {command: "help", description: "See the manual"},
  {command: "trending", description: "Get Top-7 trending on CoinGecKo"},
  {command: "p", description: "<SYMBOL> coin price"},
  {command: "q", description: "<SYMBOL> quote summary"},
  {command: "qd", description: "<SYMBOL> quote details"},
  {command: "chat", description: "Chat to GPT"},
];


const bot = new Telegraf(process.env.TELEGRAMBOT_KEY, {
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
bot.start((ctx) => ctx.reply("Welcome 🥳"));

bot.help((ctx) => ctx.reply(
    `WELCOME TO THE MANUAL
    ${BOT_COMMANDS.map((command) => (
    `/${command.command} - ${command.description}`
  )).join("\n")}`
));

// Get quote price
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
    ctx.reply(`Sorry bros. I can not get ${symbol}`);
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
    ctx.reply(`Sorry bros. I can not get ${symbol}`);
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
    ctx.reply(`Sorry bros. I can not get ${symbol}.`);
  }
});


// Get trending
bot.hears("/trending", async (ctx) => {
  try {
    const [btc, trend] = await Promise.all([
      getSimplePrice("bitcoin", "usd"),
      getTrending(),
    ]);
    const result = await trendingTemplate(btc.price, trend.coinList);
    ctx.reply(result);
  } catch (error) {
    functions.logger.error(error);
    ctx.reply(`Something wrong: ${error}`);
  }
});

// OpenAI Chat Completion
bot.hears(/^\/chat[ =](.+)$/, async (ctx) => {
  const prompt = ctx.match[1];
  try {
    const response = await chatCompletion(prompt);
    functions.logger.log(response);
    ctx.reply(
        response.message.content
    );
  } catch (error) {
    functions.logger.error(error);
    ctx.reply("Sorry bros. something wrong with OpenAI");
  }
});

bot.mention(RegExp(process.env.BOT_USERNAME, "i"), async (ctx) => {
  const prompt = ctx.match[1];
  try {
    functions.logger.log("prompt:", prompt);
    const response = await chatCompletion(prompt);
    functions.logger.log(response);
    ctx.reply(
        response.message.content
    );
  } catch (error) {
    functions.logger.error(error);
    ctx.reply("Sorry bros. something wrong with OpenAI");
  }
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

exports.bot = functions.https.onRequest(async (req, res) => {
  functions.logger.log("Incoming message", req.body);
  const listOfCommands = await bot.telegram.getMyCommands();
  if (listOfCommands.length !== BOT_COMMANDS.length) {
    await bot.telegram.setMyCommands(BOT_COMMANDS);
  }
  return await bot.handleUpdate(req.body, res).then((rv) => {
    return !rv && res.sendStatus(200);
  });
});
