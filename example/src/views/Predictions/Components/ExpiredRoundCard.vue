<template>
  <div class="prediction-com">
    <div class="prediction-card prediction-expired">
      <div class="prediction-panel">
        <div class="card-header">
          <div class="header-left">
            <v-icon class="mr-1" size="20">mdi-cancel</v-icon>
            <span>Expired</span>
          </div>
          <div class="header-right">#{{ round.epoch }}</div>
        </div>
        <div class="card-content">
          <div class="up-area" :class="[{'up-activited':(trend==='up')}]"
          >
            <svg height="65px" width="240px" viewBox="0 0 240 65" color="text" xmlns="http://www.w3.org/2000/svg"
                 class="sc-bdnxRM kDWlca">
              <g filter="url(#filter0_i)">
                <path
                    d="M10.0001 49.2757L10.0003 64H234L234 49.2753C234 42.5136 229.749 36.4819 223.381 34.2077L138.48 3.8859C127.823 0.0796983 116.177 0.0796931 105.519 3.8859L20.6188 34.2076C14.2508 36.4819 10.0001 42.5138 10.0001 49.2757Z"
                    fill="currentColor"></path>
              </g>
              <defs>
                <filter id="filter0_i" x="10.0001" y="1.03125" width="224" height="62.9688" filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="area-title fc-green">UP</div>
            <div class="area-info">{{ bullMultiplier }}x Payout</div>
          </div>
          <div class="card-info" :class="[{'info-up':(trend==='up')},{'info-down':(trend==='down')}]">
            <div class="info-title">
              <span>CLOSED PRICE</span>
            </div>
            <div class="price-meta">
              <div class="price-text" :class="[{'fc-green':(trend==='up')},{'fc-red':(trend==='down')}]">
                ${{ round.closePrice.toFixed(3) }}
              </div>
              <div class="rate-text" :class="[{'bg-green':(trend==='up')},{'bg-red':(trend==='down')}]">
                <v-icon size="20" class="mr-1" color="#fff">
                  {{ trend === 'up' ? 'mdi-arrow-up' : 'mdi-arrow-down' }}
                </v-icon>
                <span>$</span>
                <span>{{ trend === 'up' ? '+' : '' }}</span>
                <span>{{ (round.closePrice - round.lockPrice).toFixed(3) }}</span>
              </div>
            </div>
            <div class="locked-price">
              <span>Locked Price:</span>
              <span>${{ round.lockPrice.toFixed(3) }}</span>
            </div>
            <div class="prize-pool">
              <span>Prize Pool:</span>
              <span>{{ round.totalAmount.toFixed(3) }}BNB</span>
            </div>
          </div>
          <div class="down-area" :class="[{'down-activited':(trend==='down')}]">
            <svg height="65px" width="240px" viewBox="0 0 240 65" color="text" xmlns="http://www.w3.org/2000/svg"
                 class="sc-bdnxRM kDWlca">
              <g filter="url(#filter0_i)">
                <path
                    d="M10.0001 15.7243L10.0003 1H234L234 15.7247C234 22.4864 229.749 28.5181 223.381 30.7923L138.48 61.1141C127.823 64.9203 116.177 64.9203 105.519 61.1141L20.6188 30.7924C14.2508 28.5181 10.0001 22.4862 10.0001 15.7243Z"
                    fill="currentColor"></path>
              </g>
              <defs>
                <filter id="filter0_i" x="10.0001" y="1" width="224" height="62.9688" filterUnits="userSpaceOnUse"
                        color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                 result="hardAlpha"></feColorMatrix>
                  <feOffset></feOffset>
                  <feGaussianBlur stdDeviation="1"></feGaussianBlur>
                  <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"></feColorMatrix>
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow"></feBlend>
                </filter>
              </defs>
            </svg>
            <div class="area-info">{{ bearMultiplier }}x Payout</div>
            <div class="area-title fc-red">DOWN</div>
          </div>
        </div>
        <collect-winnings-overlay
            v-if="hasEntered && isWin"
            :round-id="round.id"
            :epoch="round.epoch"
            :payout="payout"
            :is-bottom="hasEnteredDown"
            :bet="bet"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {getNetPayout} from "@/utils/helpers";
import CollectWinningsOverlay from "@/views/Predictions/Components/CollectWinningsOverlay";

export default {
  components: {CollectWinningsOverlay},
  props: ['round', 'bullMultiplier', 'bearMultiplier', 'hasEnteredDown', 'hasEnteredUp', 'betAmount', 'hasEntered', 'bet'],
  computed: {
    ...mapState(['prediction']),
    trend() {
      return this.round.closePrice > this.round.lockPrice ? 'up' : (this.round.closePrice < this.round.lockPrice ? 'down' : '')
    },
    isWin() {
      return this.hasEntered  && this.bet.position === this.round.position
    },
    rewardRate() {
      return this.prediction.rewardRate / 100
    },
    payout() {
      return getNetPayout(this.bet, this.rewardRate);
    }
  }
}
</script>