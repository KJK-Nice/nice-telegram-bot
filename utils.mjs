export const prettyNum = (num) => {
    const nump = Number(num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    return nump
}

export const prettyUsd = (num) => {
    const nump = Number(num).toLocaleString('en-EN', { style: 'currency', currency: 'USD' })
    return nump
}

export const processMoon = (percent) => {
    if (percent > 0 && percent < 0.2) {
        return '🌑'
    } else if (percent > 0.2 && percent < 0.4) {
        return '🌘'
    } else if (percent > 0.4 && percent < 0.6) {
        return '🌗'
    } else if (percent > 0.6 && percent < 0.8) {
        return '🌖'
    } else if (percent > 0.8) {
        return '🌕'
    }
}