<template>
  <div class="wrapper d-flex justify-center" :class="isBottom?'w-bottom':'w-top '">
    <v-btn depressed color="error" @click.stop="dialog = true" :disabled="bet.claimed">Collect Winnings</v-btn>
    <v-dialog v-model="dialog" width="320">
      <v-card>
        <v-card-title class="text-h5">Collect Winnings</v-card-title>

        <v-card-text>
          <div class="d-flex justify-space-between">
            <div>手续费</div>
            <div>
              <div>{{ bnb }}BNB</div>
              <div>~${{ usdt }}</div>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              :loading="isPendingTx"
              @click="handleClick"
          >
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {formatBnb, usePriceBnbBusd} from '@/utils/helpers'
import {getPredictionsContract} from "@/utils/contract";

export default {
  name: "CollectWinningsOverlay",
  props: ['roundId', 'epoch', 'payout', 'isBottom','bet'],
  data() {
    return {
      dialog: false,
      isPendingTx: false,
    }
  },
  computed: {
    bnb() {
      return formatBnb(this.payout);
    },
    usdt() {
      const bnbBusdPrice = usePriceBnbBusd()
      return formatBnb(bnbBusdPrice.times(this.payout).toNumber());
    }
  },
  methods: {
    async handleClick() {
      try {
        this.isPendingTx = true;
        const tx = await getPredictionsContract().claim(this.epoch)
        const receipt = await tx.wait()
        this.isPendingTx = false
        if (receipt.status) {

        } else {

        }
      } catch (error) {
        this.isPendingTx = false
      }
    }
  }

}
</script>
<style scoped lang="scss">
.wrapper {
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 30;
}

.w-top {
  top: 42px;
}

.w-bottom {
  border-radius: 0 0 16px 16px;
  bottom: 2px;
}
</style>