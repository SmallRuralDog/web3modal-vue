import {request, gql} from 'graphql-request'
import {parseInt, orderBy, cloneDeep} from 'lodash'
import {getOracleContract, getPredictionsContract} from "@/utils/contract";
import BigNumber from "bignumber.js";
import {getBalanceAmount} from "@/utils/formatBalance";
import {BIG_ZERO} from "@/utils/bigNumber";
import {GRAPH_API_PREDICTION} from "@/config/endpoints";
import {numberOrNull} from "@/utils/helpers";
import web3Modal from "@/store/modules/web3Modal";


const predictionStore = {
    state: {
        marketLoading: true,
        rounds: [],
        market: {},
        price: BIG_ZERO,
        bets: {},
        status: true,
        currentEpoch: 0,
        intervalBlocks: 0,
        bufferBlocks: 0,
        minBetAmount: "",
        rewardRate: 0,
    },
    getters: {},
    mutations: {
        setRounds(state, payload) {
            let list = payload.map(transformRoundResponse)

            list.push({
                epoch: list[0].epoch + 1,
                id: (list[0].epoch + 1).toString(),
            })

            list.push({
                epoch: list[0].epoch + 2,
                id: (list[0].epoch + 2).toString(),
            })
            state.rounds = orderBy(list, 'epoch', 'asc')
        },
        setMarket(state, payload) {
            state.market = transformMarketResponse(payload)
            state.currentEpoch = state.market.currentEpoch
            state.marketLoading = false;
        },
        setPrice(state, payload) {
            state.price = payload;
        },
        setBets(state, payload) {
            state.bets = payload;
        },
        status(state, status) {
            state.status = status;
        },
        currentEpoch(state, currentEpoch) {
            state.currentEpoch = currentEpoch;
        },
        intervalBlocks(state, intervalBlocks) {
            state.intervalBlocks = intervalBlocks;
        },
        bufferBlocks(state, bufferBlocks) {
            state.bufferBlocks = bufferBlocks;
        },
        minBetAmount(state, minBetAmount) {
            state.minBetAmount = minBetAmount;
        },
        rewardRate(state, rewardRate) {
            state.rewardRate = rewardRate;
        },
    },
    actions: {
        async getMarketData({commit, dispatch, state}) {
            const query = gql`
              query getMarketData {
                rounds(first: 5, orderBy: epoch, orderDirection: desc) {
                  ${getRoundBaseFields()}
                }
                market(id: 1) {
                  id
                  paused
                  epoch {
                    epoch
                  }
                }
              }
            `;
            const {market, rounds} = await request(GRAPH_API_PREDICTION, query)
            commit('setRounds', rounds)
            commit('setMarket', market)

            dispatch('fetchCurrentBets', {
                account: web3Modal.state.account.toLowerCase(),
                roundIds: state.rounds.filter(round => round.id).map((round) => round.id)
            })
        },
        async fetchCurrentBets({commit, state}, {account, roundIds}) {
            const betResponses = await getBetHistory({
                user: account.toLowerCase(),
                round_in: roundIds,
            })

            let maps = {}
            betResponses.map(transformBetResponse).forEach(bet => {
                maps[bet.round.id] = bet
            })
            let bets = cloneDeep(state.bets)
            bets[account] = maps;
            commit('setBets', bets)
        },
        async getLatestOraclePrice({commit}) {
            const contract = getOracleContract()
            const response = await contract['latestRoundData']()
            const price = getBalanceAmount(new BigNumber(response[1].toString()), 8)
            commit('setPrice', price.toNumber())
        },
        async getStaticPredictionsData({commit}) {
            const {
                status,
                currentEpoch,
                intervalBlocks,
                bufferBlocks,
                minBetAmount,
                rewardRate
            } = await getStaticPredictionsData()

            commit('status', status)
            commit('currentEpoch', currentEpoch)
            commit('intervalBlocks', intervalBlocks)
            commit('bufferBlocks', bufferBlocks)
            commit('minBetAmount', minBetAmount)
            commit('rewardRate', rewardRate)
        }
    },
}
export default predictionStore

export const getStaticPredictionsData = async () => {

    const contract = getPredictionsContract()

    let data = {};
    for (const method of ['currentEpoch', 'intervalBlocks', 'minBetAmount', 'paused', 'bufferBlocks', 'rewardRate']) {
        data[method] = await contract[method]()
    }
    return {
        status: true,
        currentEpoch: data.currentEpoch.toNumber(),
        intervalBlocks: data.intervalBlocks.toNumber(),
        bufferBlocks: data.bufferBlocks.toNumber(),
        minBetAmount: data.minBetAmount.toString(),
        rewardRate: data.rewardRate.toNumber(),
    }
}

export const getBetHistory = async (where = {}, first = 1000, skip = 0) => {
    const query = gql`
              query getBetHistory($first: Int!, $skip: Int!, $where: Bet_filter) {
                bets(first: $first, skip: $skip, where: $where) {
                  ${getBetBaseFields()}
                  round {
                    ${getRoundBaseFields()}
                  }
                  user {
                    ${getUserBaseFields()}
                  } 
                }
              }
            `;
    const {bets} = await request(GRAPH_API_PREDICTION, query, {first, skip, where})
    return bets;
}

export const transformRoundResponse = (roundResponse) => {

    const {
        id,
        epoch,
        failed,
        startBlock,
        startAt,
        lockAt,
        lockBlock,
        lockPrice,
        endBlock,
        closePrice,
        totalBets,
        totalAmount,
        bullBets,
        bearBets,
        bearAmount,
        bullAmount,
        position,
        bets = [],
    } = roundResponse

    return {
        id,
        failed,
        epoch: numberOrNull(epoch),
        startBlock: numberOrNull(startBlock),
        startAt: numberOrNull(startAt),
        lockAt: numberOrNull(lockAt),
        lockBlock: numberOrNull(lockBlock),
        lockPrice: lockPrice ? parseFloat(lockPrice) : null,
        endBlock: numberOrNull(endBlock),
        closePrice: closePrice ? parseFloat(closePrice) : null,
        totalBets: numberOrNull(totalBets),
        totalAmount: totalAmount ? parseFloat(totalAmount) : 0,
        bullBets: numberOrNull(bullBets),
        bearBets: numberOrNull(bearBets),
        bearAmount: numberOrNull(bearAmount),
        bullAmount: numberOrNull(bullAmount),
        position: position,
        bets: bets.map(transformBetResponse),
    }
}

export const transformMarketResponse = (marketResponse) => {
    return {
        id: marketResponse.id,
        paused: marketResponse.paused,
        epoch: Number(marketResponse.epoch.epoch),
    }
}

export const transformBetResponse = (betResponse) => {
    const bet = {
        id: betResponse.id,
        hash: betResponse.hash,
        amount: betResponse.amount ? parseFloat(betResponse.amount) : 0,
        position: betResponse.position,
        claimed: betResponse.claimed,
        claimedHash: betResponse.claimedHash,
        user: {
            id: betResponse.user.id,
            address: betResponse.user.address,
            block: numberOrNull(betResponse.user.block),
            totalBets: numberOrNull(betResponse.user.totalBets),
            totalBNB: numberOrNull(betResponse.user.totalBNB),
        },
    }
    if (betResponse.round) {
        bet.round = transformRoundResponse(betResponse.round)
    }
    return bet
}

export const getRoundBaseFields = () => `
  id
  epoch
  failed
  startAt
  startBlock
  lockAt
  lockBlock
  lockPrice
  endAt
  endBlock
  closePrice
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
  position
`

export const getBetBaseFields = () => `
  id
  hash  
  amount
  position
  claimed
  claimedHash
`

export const getUserBaseFields = () => `
  id
  address
  block
  totalBets
  totalBNB
`