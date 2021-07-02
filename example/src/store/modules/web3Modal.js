import {getLibrary} from "@/utils/web3";
import {ethers} from "ethers";
import {parseInt} from 'lodash'

const web3ModalStore = {
    state: {
        web3Modal: null,

        library: getLibrary(),
        active: false,
        account: null,
        chainId: 0,
    },
    mutations: {
        setWeb3Modal(state, web3Modal) {
            state.web3Modal = web3Modal
        },
        setLibrary(state, library) {
            state.library = library
        },
        setActive(state, active) {
            state.active = active
        },
        setAccount(state, account) {
            state.account = account.toLowerCase()
        },
        setChainId(state, chainId) {
            state.chainId = chainId
        }
    },
    actions: {
        async connect({state, commit, dispatch}) {
            const provider = await state.web3Modal.connect();

            const library = new ethers.providers.Web3Provider(provider)

            library.pollingInterval = 12000
            commit('setLibrary', library)

            const accounts = await library.listAccounts()
            if (accounts.length > 0) {
                commit('setAccount', accounts[0])
            }
            const network = await library.getNetwork()
            commit('setChainId', network.chainId)
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
            commit('setLibrary', getLibrary())
        },
    }
}

export default web3ModalStore;