'use strict'
import TelegramBot from 'node-telegram-bot-api'

const env = process.env.ENV || 'development'
import AppConfig from './config/config.json'
const config = AppConfig[env]

import {
    getCrytoQuote,
    getCrytoQuoteDetails
} from './coinmarketcap.mjs'
import {
    quoteTemplate,
    quoteDetailsTemplate,
    priceTemplate
} from './templates.mjs'


const token = config.telegram_token

const bot = new TelegramBot(token, { polling: true })

// Echo
bot.onText(/\/echo (.+)/, (msg, match) => {
    const chatId = msg.chat.id
    const resp = match[1]

    bot.sendMessage(chatId, resp)
})

// Get help
const MANUAL_TEXT = `
WELCOME TO THE MANUAL OF TELEGRAM NICE TEST BOT
/p   <SYMBOL> for get coin price (USD)
/q   <SYMBOL> for get quote summary.
/qd   <SYMBOL> for get quote details.
`
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id
    try {
        bot.sendMessage(chatId, MANUAL_TEXT)
    } catch (err) {
        console.log(err)
        bot.sendMessage(chatId, `Sorry bros. I can not give you help`)
    }
})

// Check health
bot.onText(/\/ihear/, async (msg) => {
    const chatId = msg.chat.id
    try {
        bot.sendMessage(chatId, 'too')
    } catch (err) {
        console.log(err)
        bot.sendMessage(chatId, `too doesn't hear me`)
    }
})

// Get price
bot.onText(/\/p (.+)/, async (msg, symbol) => {
    const chatId = msg.chat.id
    try {
        const resp = await getCrytoQuote(symbol[1])
        console.log({resp})
        bot.sendMessage(chatId, priceTemplate(symbol[1], resp['USD'], resp.name, resp.rank))
    } catch (err) {
        console.log(err)
        bot.sendMessage(chatId, `Sorry bros. I can not get ${symbol[1]}`)
    }
})

// Get quote
bot.onText(/\/q (.+)/, async (msg, symbol) => {
    const chatId = msg.chat.id
    try {
        const resp = await getCrytoQuote(symbol[1])
        bot.sendMessage(chatId, quoteTemplate(symbol[1], resp['USD'], resp.name, resp.rank))
    } catch (err) {
        console.log(err)
        bot.sendMessage(chatId, `Sorry bros. I can not get ${symbol[1]}`)
    }
})

// Get quote detail
bot.onText(/\/qd (.+)/, async (msg, symbol) => {
    const chatId = msg.chat.id
    try {
        const resp = await getCrytoQuoteDetails(symbol[1])
        const payload = {
            symbol: resp.symbol || symbol[1],
            quote: resp['USD'],
            rank: resp.rank,
            name: resp.name,
            tags: resp.tags.join(', '),
            circulating_supply: resp.circulating_supply,
            total_supply: resp.total_supply
        }
        bot.sendMessage(chatId, quoteDetailsTemplate(payload))
    } catch (err) {
        console.log(err)
        bot.sendMessage(chatId, `Sorry bros. I can not get ${symbol[1]}`)
    }
})
