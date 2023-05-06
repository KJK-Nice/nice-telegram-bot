const {
  prettyNum,
  prettyUsd,
  processMoon,
} = require("../utils/utils.js");

// Crypto Price template
exports.priceTemplate = (symbol, quote, name, rank) => {
  const {
    price,
    percent_change_24h: change24h,
  } = quote;
  return `
  ${name}, CMC Rank.${rank}, ${symbol.toUpperCase()}/USD
  ${change24h < 0 ? "🥶" : "🤑"} price: ${prettyUsd(price)} 
  ${change24h < 0 ? "👎" : "👍"} change 24h: ${prettyNum(change24h)} % 
  `;
};


// Quote template
exports.quoteTemplate = (symbol, quote, name, rank) => {
  const {
    price,
    volume_24h: vol24h,
    percent_change_24h: change24h,
    percent_change_7d: change7d,
    percent_change_30d: chang30d,
    percent_change_90d: change90d,
    market_cap: marketCap,
  } = quote;
  return `
  ${name}, CMC Rank.${rank}, ${ symbol.toUpperCase() }/USD
  ${change24h < 0 ? "🥶" : "🤑"} price: ${ prettyUsd(price) } 
  🌊 volume 24h: ${ prettyUsd(vol24h/1000000) } M
  ${change24h < 0 ? "👎" : "👍"} change 24h: ${ prettyNum(change24h) } % 
  ${change7d < 0 ? "👎" : "👍"} change 7d: ${ prettyNum(change7d) } % 
  ${chang30d < 0 ? "👎" : "👍"} change 30d: ${ prettyNum(chang30d) } % 
  ${change90d < 0 ? "👎" : "👍"} change 90d: ${ prettyNum(change90d) } % 
  🏪 market cap: ${ prettyUsd(marketCap/1000000) } M
  `;
};

// Quote details template
exports.quoteDetailsTemplate = (payload) => {
  console.log(payload);
  const {
    symbol,
    quote,
    rank,
    name,
    tags,
    circulatingSupply,
    totalSupply,
  } = payload;
  const {
    price,
    volume_24h: vol24h,
    percent_change_1h: change1h,
    percent_change_24h: change24h,
    percent_change_7d: change7d,
    percent_change_30d: chang30d,
    percent_change_60d: chang60d,
    percent_change_90d: change90d,
    market_cap: marketCap,
  } = quote;
  const supply = circulatingSupply/totalSupply;
  const circulatingSupplyInM = prettyNum(circulatingSupply/1000000);
  const totalSupplyInM = prettyNum(totalSupply/1000000);

  return `
  ${name}, CMC Rank.${rank}, ${ symbol }/USD
  ${change24h < 0 ? "🥶" : "🤑"} price: ${ prettyUsd(price) } 
  🌊 volume 24h: ${ prettyUsd(vol24h/1000000) } M
  ${change1h < 0 ? "👎" : "👍"} change 1h: ${ prettyNum(change1h) } % 
  ${change24h < 0 ? "👎" : "👍"} change 24h: ${ prettyNum(change24h) } % 
  ${change7d < 0 ? "👎" : "👍"} change 7d: ${ prettyNum(change7d) } % 
  ${chang30d < 0 ? "👎" : "👍"} change 30d: ${ prettyNum(chang30d) } % 
  ${chang60d < 0 ? "👎" : "👍"} change 60d: ${ prettyNum(chang60d) } % 
  ${change90d < 0 ? "👎" : "👍"} change 90d: ${ prettyNum(change90d) } % 
  🏪 market cap: ${ prettyUsd(marketCap/1000000) } M
  ${processMoon(supply)} circulating supply: ${circulatingSupplyInM} M ${symbol}
  ${processMoon(1)} total supply: ${totalSupplyInM} M ${symbol}
  🏷 tags: ${tags}
  `;
};

exports.trendingTemplate = (btc, coins) => {
  const result = coins.map((coin, index) => {
    const {
      name,
      symbol,
      market_cap_rank: rank,
      price_btc: pricePerBtc,
    } = coin.item;
    const price = prettyUsd(pricePerBtc*btc);
    return `${index + 1}. ${symbol} | ${name} | Rank. ${rank} | ${price}`;
  });
  return `
  🔥Top-7 trending coins on CoinGecko🔥
  **by searched in the last 24 hours**
${result.join("\n")}
  `;
};
