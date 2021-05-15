const functions = require("firebase-functions");
const rp = require("request-promise");

const requestOptions = (method = "GET", symbol, uri) => {
  return {
    method: method,
    uri: uri,
    qs: {
      "symbol": symbol,
    },
    headers: {
      "X-CMC_PRO_API_KEY": functions.config().cmc_api.key,
    },
    json: true,
    gzip: true,
  };
};

exports.getCryptoQuote = (symbol) => {
  const uri = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
  const upperCaseSymbol = symbol.toUpperCase();
  const req = requestOptions("GET", upperCaseSymbol, uri);
  return new Promise((resolve, reject) => {
    try {
      rp(req).then((res) => {
        const {
          data,
        } = res;
        const {
          quote,
          tags,
          name,
          cmc_rank: rank,
        } = data[`${upperCaseSymbol}`];

        console.log({
          data,
          quote,
          tags,
        });
        resolve({
          ...quote,
          name,
          rank,
        });
      }).catch((err) => {
        console.error("API call error:", err.message);
        reject(err.message);
      });
    } catch (err) {
      reject(err.message);
    }
  });
};
