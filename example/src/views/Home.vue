<template>
  <div class="home">

  </div>
</template>

<script>


import {mapState} from "vuex";

export default {
  name: 'Home',
  components: {},
  computed: {
    ...mapState['prediction']
  },
  mounted() {
    this.getMarketData()
  },
  methods: {
    getMarketData() {
      this.$store.dispatch('getMarketData')
    }
  }
}
</script>
<style lang="scss">

</style>
