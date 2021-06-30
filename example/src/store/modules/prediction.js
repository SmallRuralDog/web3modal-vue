import {gql} from '@apollo/client';
import {QglClient} from "@/utils/apollo";
import {parseInt} from 'lodash'

const predictionStore = {
    state: {
        marketData: {
            rounds: [],
            market: {}
        }
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
        }
    },
    actions: {
        async getMarketData({commit}) {
            const gqlQuery = `
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

            const {data: {market, rounds}} = await QglClient.query({query: gql(gqlQuery)})

            commit('setRounds', rounds)
            commit('setMarket', market)

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