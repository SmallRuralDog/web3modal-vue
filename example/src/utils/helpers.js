import BigNumber from "bignumber.js";
import store from '@/store'

export const numberOrNull = (value) => {
    if (value === null) {
        return null
    }
    const valueNum = Number(value)
    return Number.isNaN(valueNum) ? null : valueNum
}

export const getMultiplier = (total, amount) => {
    if (total === 0 || amount === 0) {
        return 0
    }
    return total / amount
}


export const getPayout = (bet, rewardRate = 1) => {
    if (!bet || !bet.round) {
        return 0
    }
    const {bullAmount, bearAmount, totalAmount} = bet.round
    const multiplier = getMultiplier(totalAmount, bet.position === "Bull" ? bullAmount : bearAmount)
    return bet.amount * multiplier * rewardRate
}
export const getNetPayout = (bet, rewardRate = 1) => {
    if (!bet || !bet.round) {
        return 0
    }

    const payout = getPayout(bet, rewardRate)
    return payout - bet.amount
}

export const formatBnb = (bnb) => {
    return bnb ? bnb.toLocaleString(undefined, {minimumFractionDigits: 3, maximumFractionDigits: 3}) : '0'
}

export const usePriceBnbBusd = () => {

    const price = store.state.prediction.price
    return new BigNumber(price)
}