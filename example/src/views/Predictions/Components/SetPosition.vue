<template>
  <div class="guess-content">
    <div class="amount-label">
      <span>Commit:</span>
      <div class="coin-logo">
        <img src="@/assets/images/bnb.svg" alt="">
        <span>BNB</span>
      </div>
    </div>
    <input type="number" @mousedown.stop="" class="amount-input" v-model="guessAmount"/>
    <div class="amount-balance">
      <span class="mr-1">Balance:</span>
      <span>{{ balance.toFixed(3) }}</span>
    </div>

    <div class="amount-slide" @mousedown.stop="">
      <v-slider :step="0.001" v-model="guessAmount" hide-details color="#1fc7d4" :min="0" :max="balance"
                @end="(v)=>this.value=v"/>
    </div>

    <div class="amount-radio">
      <div class="per-radio" @click="guessAmount=balance*0.1">10%</div>
      <div class="per-radio" @click="guessAmount=balance*0.25">25%</div>
      <div class="per-radio" @click="guessAmount=balance*0.5">50%</div>
      <div class="per-radio" @click="guessAmount=balance*0.75">75%</div>
      <div class="per-radio" @click="guessAmount=balance">Max</div>
    </div>

    <v-btn v-if="web3Modal.active" depressed class="guess-btn" @click="guess">Guess</v-btn>
    <v-btn v-else depressed class="guess-btn" @click="$store.dispatch('connect')">Unlock Wallet</v-btn>

    <div class="guess-intro">You won’t be able to remove or change your position once you enter it.</div>
  </div>
</template>

<script>
import {web3Modal} from "@/config/mixins";
import web3, {utils} from "web3";
import {numberOrNull} from "@/utils/helpers";
import {getPredictionsContract} from "@/utils/contract";
import BigNumber from "bignumber.js";
import {BIG_NINE, BIG_TEN} from "@/utils/bigNumber";

const gasPrice = new BigNumber(2).times(BIG_TEN.pow(BIG_NINE)).toString()
export default {
  name: "SetPosition",
  props: ['guessType'],
  mixins: [web3Modal],
  data() {
    return {
      value: 0.0,
      guessAmount: 0.0,
      balance: 0,
      timer: null,
    }
  },
  mounted() {

    this.timer = setInterval(() => {
      this.getBalance()
    }, 3000)

  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    async guess() {
      try {
        const betMethod = this.guessType === 'up' ? 'betBull' : 'betBear';
        const contract = getPredictionsContract();
        const tx = await contract[betMethod]({
          gasPrice,
          value: utils.toWei(this.guessAmount.toString())
        })
        const receipt = await tx.wait()
        if (receipt.status) {

          this.$emit('success')

          this.$store.dispatch('getMarketData');

          this.getBalance()

        } else {

        }
      } catch (e) {

      }
    },
    async getBalance() {

      const {active, account} = this.web3Modal

      if (!active) return

      const balance = await this.web3Modal.library.getBalance(account)
      this.balance = numberOrNull(web3.utils.fromWei(balance.toString()))
    }
  }
}
</script>
