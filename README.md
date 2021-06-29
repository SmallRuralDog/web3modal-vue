# Web3ModalVue

A single Web3 / Ethereum provider solution for all Wallets

## Introduction

Web3Modal is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration.

By default Web3Modal Library supports injected providers like (**Metamask**, **Dapper**, **Gnosis Safe**, **Frame**, Web3 Browsers, etc) and **WalletConnect**, You can also easily configure the library to support **Portis**, **Fortmatic**, **Squarelink**, **Torus**, **Authereum**, **D'CENT Wallet** and **Arkane**.

# React
[web3modal](https://github.com/Web3Modal/web3modal)

## Usage

1. Install Web3Modal NPM package

```bash
npm install --save web3modal-vue

# OR

yarn add web3modal-vue
```

2. Install Provider packages

```js
/* See Provider Options Section */
```

3. Then you can add Web3Modal to your Dapp as follows

```vue
<template>
  <div id="app">
    <div>
      <button @click="connect" v-if="!web3Modal.active">Connect</button>
      <div v-else>
        <div>{{ web3Modal.account }}</div>
        <div>{{ number }}</div>
        <div>
          <button @click="getBalance">getBalance</button>
          {{ balance }}
        </div>
      </div>
    </div>
    <web3-modal-vue
        ref="web3modal"
        :theme="theme"
        :provider-options="providerOptions"
        cache-provider
    />
  </div>
</template>
<script>
import Web3ModalVue from "web3modal-vue";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {mapState} from "vuex";

export default {
  components: {
    Web3ModalVue
  },
  computed: {
    ...mapState(['web3Modal'])
  },
  data() {
    return {
      theme: 'light',
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "-"
          }
        }
      },
      number: 0,
      balance: 0,
    }
  },
  created() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.theme = 'dark'
    }
  },
  mounted() {
    this.$nextTick(async () => {
      this.number = await this.web3Modal.web3.eth.getBlockNumber()
    })
    this.$nextTick(async () => {
      const web3modal = this.$refs.web3modal;
      this.$store.commit('setWeb3Modal', web3modal)
      if (web3modal.cacheProvider) {
        console.log(web3modal.cacheProvider)
        await this.$store.dispatch('connect')
        this.subscribeMewBlockHeaders()
      }

    })
  },
  methods: {
    async connect() {
      await this.$store.dispatch('connect')
      this.subscribeMewBlockHeaders()
    },
    subscribeMewBlockHeaders() {
      this.web3Modal.web3.eth.subscribe('newBlockHeaders', (err, block) => {
        this.number = block.number
      })
    },
    async getBalance() {
      let balance = await this.web3Modal.web3.eth.getBalance(this.web3Modal.account)

      this.balance = this.web3Modal.web3.utils.fromWei(balance)

      console.log(this.balance)
    }
  }
}
</script>
```

```js
import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from "web3";
import {getWeb3NoAccount} from "@/utils/web3";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        web3Modal: {
            web3Modal: null,
            web3: getWeb3NoAccount(),
            active: false,
            account: null,
            chainId: 0,
        }
    },
    mutations: {
        setWeb3Modal(state, web3Modal) {
            state.web3Modal.web3Modal = web3Modal
        },
        setWeb3(state, web3) {
            state.web3Modal.web3 = web3
        },
        setActive(state, active) {
            state.web3Modal.active = active
        },
        setAccount(state, account) {
            state.web3Modal.account = account
        },
        setChainId(state, chainId) {
            state.web3Modal.web3Modal = chainId
        }
    },
    actions: {
        async connect({state, commit, dispatch}) {
            const provider = await state.web3Modal.web3Modal.connect();
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
                console.log("connect", info)
            });

            provider.on("accountsChanged", async (accounts) => {
                if (accounts.length > 0) {
                    commit('setAccount', accounts[0])
                } else {
                    commit('setAccount', null)
                    await dispatch('resetApp')
                }
                console.log("accountsChanged")
            });
            provider.on("chainChanged", async (chainId) => {
                commit('setChainId', chainId)
                console.log("chainChanged")
            });

        },
        async resetApp({state, commit}) {
            try {
                await state.web3Modal.web3Modal.clearCachedProvider();
            } catch (error) {
                console.error(error)
            }
            commit('setAccount', null)
            commit('setActive', false)
        }
    },
})
```

## Provider Options

These are all the providers available with Web3Modal and how to configure their provider options:

- [WalletConnect](https://github.com/Web3Modal/web3modal/docs/providers/walletconnect.md)
- [Fortmatic](https://github.com/Web3Modal/web3modal/docs/providers/fortmatic.md)
- [Torus](https://github.com/Web3Modal/web3modal/docs/providers/torus.md)
- [Portis](https://github.com/Web3Modal/web3modal/docs/providers/portis.md)
- [Authereum](https://github.com/Web3Modal/web3modal/docs/providers/authereum.md)
- [Frame](https://github.com/Web3Modal/web3modal/docs/providers/frame.md)
- [Bitski](https://github.com/Web3Modal/web3modal/docs/providers/bitski.md)
- [Arkane](https://github.com/Web3Modal/web3modal/docs/providers/arkane.md)
- [DCent](https://github.com/Web3Modal/web3modal/docs/providers/dcent.md)
- [BurnerConnect](https://github.com/Web3Modal/web3modal/docs/providers/burnerconnect.md)
- [MEWConnect](https://github.com/Web3Modal/web3modal/docs/providers/mewconnect.md)

# Example
[https://github.com/SmallRuralDog/web3modal-vue/tree/master/example](https://github.com/SmallRuralDog/web3modal-vue/tree/master/example)

# Demo
[https://smallruraldog.github.io/web3modal-vue](https://smallruraldog.github.io/web3modal-vue/#/)

## License

MIT