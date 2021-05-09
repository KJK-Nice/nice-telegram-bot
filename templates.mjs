import {prettyNum, prettyUsd, processMoon} from './utils.mjs'

// Cryto Price template
export const priceTemplate = (symbol, quote, name, rank) => (`
${name}, CMC Rank.${rank}, ${ symbol.toUpperCase() }/USD
${quote.percent_change_24h < 0 ? '🥶' : '🤑'} price: ${ prettyUsd(quote.price) } 
${quote.percent_change_24h < 0 ? '👎' : '👍'} change 24h: ${ prettyNum(quote.percent_change_24h) } % 
`)

// Quote template
export const quoteTemplate = (symbol, quote, name, rank) => (`
${name}, CMC Rank.${rank}, ${ symbol.toUpperCase() }/USD
${quote.percent_change_24h < 0 ? '🥶' : '🤑'} price: ${ prettyUsd(quote.price) } 
🌊 volume 24h: ${ prettyUsd(quote.volume_24h/1000000) } M
${quote.percent_change_24h < 0 ? '👎' : '👍'} change 24h: ${ prettyNum(quote.percent_change_24h) } % 
${quote.percent_change_7d < 0 ? '👎' : '👍'} change 7d: ${ prettyNum(quote.percent_change_7d) } % 
${quote.percent_change_30d < 0 ? '👎' : '👍'} change 30d: ${ prettyNum(quote.percent_change_30d) } % 
${quote.percent_change_90d < 0 ? '👎' : '👍'} change 90d: ${ prettyNum(quote.percent_change_90d) } % 
🏪 market cap: ${ prettyUsd(quote.market_cap/1000000) } M
`)

// Quote details template
export const quoteDetailsTemplate = ({
    symbol,
    quote,
    rank,
    name,
    tags,
    circulating_supply,
    total_supply
}) => (`
${name}, CMC Rank.${rank}, ${ symbol }/USD
${quote.percent_change_24h < 0 ? '🥶' : '🤑'} price: ${ prettyUsd(quote.price) } 
🌊 volume 24h: ${ prettyUsd(quote.volume_24h/1000000) } M
${quote.percent_change_1h < 0 ? '👎' : '👍'} change 1h: ${ prettyNum(quote.percent_change_1h) } % 
${quote.percent_change_24h < 0 ? '👎' : '👍'} change 24h: ${ prettyNum(quote.percent_change_24h) } % 
${quote.percent_change_7d < 0 ? '👎' : '👍'} change 7d: ${ prettyNum(quote.percent_change_7d) } % 
${quote.percent_change_30d < 0 ? '👎' : '👍'} change 30d: ${ prettyNum(quote.percent_change_30d) } % 
${quote.percent_change_60d < 0 ? '👎' : '👍'} change 60d: ${ prettyNum(quote.percent_change_60d) } % 
${quote.percent_change_90d < 0 ? '👎' : '👍'} change 90d: ${ prettyNum(quote.percent_change_90d) } % 
🏪 market cap: ${ prettyUsd(quote.market_cap/1000000) } M
${processMoon(circulating_supply/total_supply)} circulating supply: ${prettyNum(circulating_supply/1000000)} M ${symbol}
${processMoon(1)} total supply: ${prettyNum(total_supply/1000000)} M ${symbol}
🏷 tags: ${tags}
`)
