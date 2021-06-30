# Web3ModalVue

A single Web3 / Ethereum provider solution for all Wallets

## Introduction

Web3Modal is an easy-to-use library to help developers add support for multiple providers in their apps with a simple customizable configuration.

By default Web3Modal Library supports injected providers like (**Metamask**, **Dapper**, **Gnosis Safe**, **Frame**, Web3 Browsers, etc) and **WalletConnect**, You can also easily configure the library to support **Portis**, **Fortmatic**, **Squarelink**, **Torus**, **Authereum**, **D'CENT Wallet** and **Arkane**.

## React
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
import {web3Modal} from "./config/mixins";
import Header from "@/components/Header";

export default {
  components: {
    Header,
    Web3ModalVue
  },
  mixins: [web3Modal],
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
      const web3modal = this.$refs.web3modal;
      this.$store.commit('setWeb3Modal', web3modal)
      if (web3modal.cachedProvider) {
        await this.$store.dispatch('connect')
        this.subscribeMewBlockHeaders()
      }

    })
  },
  methods: {
    connect() {
      this.$store.dispatch('connect')
    },
  }
}
</script>
```

```js
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
            state.account = account
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
```

## Provider Options

These are all the providers available with Web3Modal and how to configure their provider options:

- [WalletConnect](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/walletconnect.md)
- [Fortmatic](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/fortmatic.md)
- [Torus](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/torus.md)
- [Portis](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/portis.md)
- [Authereum](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/authereum.md)
- [Frame](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/frame.md)
- [Bitski](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/bitski.md)
- [Arkane](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/arkane.md)
- [DCent](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/dcent.md)
- [BurnerConnect](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/burnerconnect.md)
- [MEWConnect](https://github.com/Web3Modal/web3modal/blob/master/docs/providers/mewconnect.md)

## Who using it

[Submit my Dapp](https://github.com/SmallRuralDog/web3modal-vue/issues/1)

## Example
[https://github.com/SmallRuralDog/web3modal-vue/tree/master/example](https://github.com/SmallRuralDog/web3modal-vue/tree/master/example)

## Demo
[https://smallruraldog.github.io/web3modal-vue](https://smallruraldog.github.io/web3modal-vue/#/)

## License

MIT