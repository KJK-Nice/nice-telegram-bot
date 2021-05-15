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
    fetch(uri, optionsFetchGet).then((res) => {
      resolve( res.json());
    }).catch((err) => {
      console.error("API call error:", err.message);
      reject(err.message);
    });
  });
};
