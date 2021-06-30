import {request, gql} from 'graphql-request'
import {parseInt} from 'lodash'
import {getOracleContract} from "@/utils/contract";
import BigNumber from "bignumber.js";
import {getBalanceAmount} from "@/utils/formatBalance";
import {BIG_ZERO} from "@/utils/bigNumber";
import {GRAPH_API_PREDICTION} from "@/config/endpoints";

const predictionStore = {
    state: {
        marketData: {
            rounds: [],
            market: {}
        },
        price: BIG_ZERO,
    },
    getters: {},
    mutations: {
        setRounds(state, payload) {
            state.marketData.rounds = payload.map(e => {
                return {
                    id: e.id,
                    epoch: Number(e.epoch),
                    failed: e.failed,
                    startBlock: Number(e.startBlock),
                    startAt: Number(e.startAt),
                    lockAt: Number(e.lockAt),
                    lockBlock: Number(e.lockBlock),
                    lockPrice: Number(e.lockPrice),
                    endBlock: Number(e.endBlock),
                    closePrice: Number(e.closePrice),
                    totalBets: Number(e.totalBets),
                    totalAmount: Number(e.totalAmount),
                    bullBets: Number(e.bullBets),
                    bearBets: Number(e.bearBets),
                    bearAmount: Number(e.bearAmount),
                    bullAmount: Number(e.bullAmount),
                    position: e.position
                }
            })
        },
        setMarket(state, payload) {
            state.marketData.market = {
                id: payload.id,
                paused: payload.paused,
                epoch: parseInt(payload.epoch.epoch),
            }
        },
        setPrice(state, payload) {
            state.price = payload;
        }
    },
    actions: {
        async getMarketData({commit}) {
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
            `
            const {market, rounds} = await request(GRAPH_API_PREDICTION, query)
            commit('setRounds', rounds)
            commit('setMarket', market)
        },
        async getLatestOraclePrice({commit}) {
            const contract = getOracleContract()
            const response = await contract['latestRoundData']()
            const price = getBalanceAmount(new BigNumber(response[1].toString()), 8)
            commit('setPrice', price)
        }
    },
}
export default predictionStore

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