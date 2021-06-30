<template>
  <div class="card">
    <div></div>
    <div>
      <div>
        <v-text-field v-model="value"/>
      </div>
      <div>
        <v-slider :min="0" :max="1000" :step="100" ticks thumb-label/>
      </div>
      <div>
        <v-btn block large color="primary" @click="bet" :disabled="value<=0">提交</v-btn>
      </div>
      <div>You won’t be able to remove or change your position once you enter it.</div>
    </div>
  </div>
</template>

<script>
import {web3Modal} from "@/config/mixins";
import {getPredictionsContract} from "@/utils/contract";
import {utils} from "web3";
import BigNumber from "bignumber.js";
import {BIG_NINE, BIG_TEN} from "@/utils/bigNumber";

const gasPrice = new BigNumber(5).times(BIG_TEN.pow(BIG_NINE)).toString()
export default {
  name: "SetPosition",
  data() {
    return {
      value: 0.1,
      toggle_exclusive: 0
    }
  },
  mixins: [web3Modal],
  computed: {},
  methods: {
    async bet() {
      try {
        const contract = getPredictionsContract();
        console.log(contract)
        const tx = await contract['betBull']({
          gasPrice,
          value: utils.toWei(this.value.toString())
        })
        const receipt = await tx.wait()
        if (receipt.status) {

        } else {

        }
      } catch (e) {

      }
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  width: 320px;
}
</style>