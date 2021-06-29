<template>
  <div id="app">

    <div>
      <button @click="connect" v-if="!web3Modal.active">连接钱包</button>
      <div v-else>
        <div>{{ web3Modal.account }}</div>
      </div>
    </div>

    <web3-modal-vue
        ref="web3modal"
        :theme="theme"
        cache-provider
    />
  </div>
</template>
<script>
import Web3ModalVue from "web3modal-vue";

export default {
  components: {
    Web3ModalVue
  },
  computed: {
    web3Modal() {
      return this.$store.state.web3Modal
    },
  },
  data() {
    return {
      theme: 'light'
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
      if (web3modal.cacheProvider) {
        await this.$store.dispatch('connect')
      }

    })
  },
  methods: {
    async connect() {
      await this.$store.dispatch('connect')
    }
  }
}
</script>

