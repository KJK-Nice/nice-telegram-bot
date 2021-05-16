const functions = require("firebase-functions");
const fetch = require("node-fetch");


const optionsFetchGet = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "X-CMC_PRO_API_KEY": functions.config().cmc_api.key,
  },
};

exports.getCryptoQuote = (symbol) => {
  const uri = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`;
  const upperCaseSymbol = symbol.toUpperCase();
  return new Promise((resolve, reject) => {
    fetch(uri, optionsFetchGet).then(async (res) => {
      const response = await res.json();
      functions.logger.log("API response:", response);
      const {
        quote,
        symbol,
        name,
        tags,
        cmc_rank: rank,
        circulating_supply: circulatingSupply,
        total_supply: totalSupply,
      } = response.data[`${upperCaseSymbol}`];
      const usd = quote.USD;
      resolve({
        usd,
        name,
        tags,
        rank,
        symbol,
        circulatingSupply,
        totalSupply,
      });
    }).catch((err) => {
      functions.logger.error("API call error:", err.message);
      reject(err.message);
    });
  });
};
