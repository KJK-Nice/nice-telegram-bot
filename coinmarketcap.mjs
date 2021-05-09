const env = process.env.ENV || 'development'
import AppConfig from './config/config.json'
const config = AppConfig[env]

import rp from 'request-promise'


const requestOptions = (method='GET', symbol, uri) =>{

  return {
    method: method, 
    uri: uri,
    qs: {
      'symbol': symbol 
    },
    headers: {
      'X-CMC_PRO_API_KEY': config.cmc_api_key
    },
    json: true,
    gzip: true
  }
};

export const getCrytoQuote = (symbol) => {
  const uri = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
  const upperCaseSymbol = symbol.toUpperCase()
  const req = requestOptions('GET', upperCaseSymbol, uri)
  return new Promise((resolve, reject) => {
    try {
      rp(req).then(res => {
        const {
          data
        } = res
        const {
          quote,
          tags,
          name,
          cmc_rank: rank
        } = data[`${upperCaseSymbol}`]
  
        console.log({
          data,
          quote,
          tags
        })
        resolve({...quote, name, rank})
      }).catch((err) => {
        console.error('API call error:', err.message)
        reject(err.message)
      })
    } catch (err) {
      reject(err.message)
    }
  
  })
}

export const getCrytoQuoteDetails = (symbol) => {
  const uri = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest'
  const upperCaseSymbol = symbol.toUpperCase()
  const req = requestOptions('GET', upperCaseSymbol, uri)
  return new Promise((resolve, reject) => {
    try {
      rp(req).then(res => {
        const {
          data
        } = res
        const {
          quote,
          symbol,
          tags,
          name,
          cmc_rank: rank,
          circulating_supply,
          total_supply
        } = data[`${upperCaseSymbol}`]
        resolve({...quote, name, rank, tags, circulating_supply, total_supply})
      }).catch((err) => {
        console.error('API call error:', err.message)
        reject(err.message)
      })
    } catch (err) {
      reject(err.message)
    }
  
  })
}
