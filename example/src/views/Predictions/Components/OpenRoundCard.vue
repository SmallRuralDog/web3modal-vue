<template>
  <div class="prediction-com">
    <div
        class="prediction-card"
        :class="['prediction-next',{'card-flipped':(showGuessPanel)}]"
    >
      <div
          class="guess-panel"
          :style="'z-index:'+(showGuessPanel?2:1)"
      >
        <div class="guess-header">
          <div class="header-left">
            <v-icon class="mr-2" size="24" @click="changeShowGuess(false)">mdi-arrow-left</v-icon>
            <span>Set Position</span>
          </div>
          <v-btn
              depressed
              class="header-right"
              :class="[{'bg-green':(guessType==='up')},{'bg-red':(guessType==='down')}]"
              @click="changeGuessType"
          >
            <template v-if="guessType==='up'">
              <v-icon size="20" class="mr-1">mdi-arrow-up</v-icon>
              <span>UP</span>
            </template>
            <template v-if="guessType==='down'">
              <v-icon size="20" class="mr-1">mdi-arrow-down</v-icon>
              <span>DOWN</span>
            </template>
          </v-btn>
        </div>
        <set-position
            :guess-type="guessType"
            @success="changeShowGuess(false)"
        />
      </div>

      <div class="prediction-panel" :style="'z-index:'+(!showGuessPanel?2:1)"
      >
        <div class="card-header">
          <div class="header-left">
            <v-icon class="mr-1" size="20">mdi-play-circle-outline</v-icon>
            <span>Next</span>
          </div>
          <div class="header-right">#{{ round.epoch }}</div>
        </div>
        <div class="card-content">
          <div class="up-area">
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
            <div class="area-info">{{ bearMultiplier }}x Payout</div>
          </div>
          <div class="card-info">
            <div class="prize-pool mb-2">
              <span>Prize Pool:</span>
              <span>{{ round.totalAmount }}BNB</span>
            </div>
            <div v-if="hasEntered" class="d-flex justify-space-between  font-weight-bold"
                 :class="{'green--text':hasEnteredUp,'red--text':hasEnteredUp}">
              <div>Bet <span v-if="hasEnteredUp">Bull</span><span v-if="hasEnteredDown">Bear</span></div>
              <div>{{ betAmount }} BNB</div>
            </div>
            <template v-else>
              <v-btn class="enter-btn bg-green mb-1" @click="startGuess('up')">
                Enter UP
              </v-btn>
              <v-btn class="enter-btn bg-red" @click="startGuess('down')">
                Enter DOWN
              </v-btn>
            </template>
          </div>
          <div class="down-area">
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
            <div class="area-info">{{ bullMultiplier }}x Payout</div>
            <div class="area-title fc-red">DOWN</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SetPosition from "@/views/Predictions/Components/SetPosition";

export default {
  name: "OpenRoundCard",
  components: {SetPosition},
  props: ['round', 'bullMultiplier', 'bearMultiplier', 'hasEnteredDown', 'hasEnteredUp', 'betAmount', 'hasEntered'],
  data() {
    return {
      guessType: 'up',
      showGuessPanel: false,
      guessAmount: 0,
    }
  },
  mounted() {

  },
  methods: {
    startGuess(up_down) {
      this.guessType = up_down
      this.changeShowGuess(true)
    },
    changeShowGuess(show) {
      this.showGuessPanel = show
    },
    changeGuessType() {
      this.guessType = this.guessType === 'up' ? 'down' : 'up'
    },
    guess() {
      alert('start guess')
    }
  }
}
</script>
