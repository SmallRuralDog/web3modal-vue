import {getWeb3NoAccount} from "@/utils/web3";
import Web3 from "web3";
import {getPredictionsContract} from "@/utils/contract";
import {parseInt} from 'lodash'

const web3ModalStore = {
    state: {
        web3Modal: null,
        web3: getWeb3NoAccount(),
        active: false,
        account: null,
        chainId: 0,
    },
    mutations: {
        setWeb3Modal(state, web3Modal) {
            state.web3Modal = web3Modal
        },
        setWeb3(state, web3) {
            state.web3 = web3
        },
        setActive(state, active) {
            state.active = active
        },
        setAccount(state, account) {
            state.account = account
        },
        setChainId(state, chainId) {
            state.chainId = chainId
        }
    },
    actions: {
        async connect({state, commit, dispatch}) {
            const provider = await state.web3Modal.connect();
            const web3 = new Web3(provider)
            commit('setWeb3', web3)
            const accounts = await web3.eth.getAccounts()
            if (accounts.length > 0) {
                commit('setAccount', accounts[0])
            }
            const chainId = await web3.eth.getChainId()
            commit('setChainId', chainId)
            commit('setActive', true)

            provider.on("connect", async (info) => {
                let chainId = parseInt(info.chainId)
                commit('setChainId', chainId)
                console.log("connect", info)
            });

            provider.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    commit('setAccount', accounts[0])
                } else {
                    await dispatch('resetApp')
                }
                console.log("accountsChanged")
            });
            provider.on("chainChanged", async (chainId) => {
                chainId = parseInt(chainId)
                commit('setChainId', chainId)
                console.log("chainChanged", chainId)
            });

        },
        async resetApp({state, commit}) {
            try {
                await state.web3Modal.clearCachedProvider();
            } catch (error) {
                console.error(error)
            }
            commit('setAccount', null)
            commit('setActive', false)
        },
    },
    getters: {
        predictionsContract: state => {
            return getPredictionsContract(state.web3)
        }
    },
}

export default web3ModalStore;