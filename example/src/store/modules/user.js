const userStore = {
    state: {
        balance: 0,
    },
    getters: {},
    mutations: {
        setBalance(state, payload) {
            state.balance = payload;
        }
    },
    actions: {
        async getBalance({state, commit}) {
            const balance = await state.web3.eth.getBalance(state.account)
            commit('setBalance', balance)
        }
    },
}
export default userStore