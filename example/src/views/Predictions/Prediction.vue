<template>
  <div>
    <set-position/>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SetPosition from "@/views/Predictions/SetPosition";
import {web3Modal} from "@/config/mixins";

export default {
  name: "Prediction",
  components: {SetPosition},
  computed: {
    ...mapState['prediction']
  },
  mixins: [web3Modal],
  data() {
    return {
      timer: null,
    }
  },
  mounted() {

    this.$nextTick(() => {
      this.initData()
      this.timer = setInterval(() => {
        this.initData()
      }, 10000)
    })
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    initData() {
      this.$store.dispatch('getLatestOraclePrice');
      this.$store.dispatch('getMarketData');
    }
  }
}
</script>

<style scoped>

</style>