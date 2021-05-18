const functions = require("firebase-functions");
const fetch = require("node-fetch");

const optionsFetchGet = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

exports.getSimplePrice = (id = "bitcoin", base = "usd") => {
  const uri = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=${base}`;
  return new Promise((resolve, reject) => {
    fetch(uri, optionsFetchGet).then(async (res) => {
      const response = await res.json();
      functions.logger.log("API response:", response);
      const price = response[`${id}`][`${base}`];
      resolve({
        price,
      });
    }).catch((err) => {
      functions.logger.error("API call error:", err.message);
      reject(err.message);
    });
  });
};

exports.getTrending = () => {
  const uri = "https://api.coingecko.com/api/v3/search/trending";
  return new Promise((resolve, reject) => {
    fetch(uri, optionsFetchGet).then(async (res) => {
      const response = await res.json();
      functions.logger.log("API response:", response);
      const coinList = response.coins;
      resolve({
        coinList,
      });
    }).catch((err) => {
      functions.logger.error("API call error:", err.message);
      reject(err.message);
    });
  });
};

