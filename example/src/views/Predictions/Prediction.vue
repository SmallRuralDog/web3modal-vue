<template>
  <div class="home-page flex flex-column overflow-hidden">
    <div v-if="!prediction.marketLoading">
      <v-row class="pa-4 mb-4">
        <v-col>
          <div class="coin-balance">
            <img src="@/assets/images/bnb.svg" alt="">
            <div class="coin-title">BNBUSDT</div>
            <div class="coin-amount">${{ prediction.price.toFixed(3) }}</div>
          </div>
        </v-col>
        <v-col>
          <div class="toggle-prediction">
            <v-btn icon small @click="goPrediction('-1')">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <img src="@/assets/images/prediction.svg" alt="" @click="goPrediction(null)">
            <v-btn icon small @click="goPrediction('+1')">
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-col>
        <v-col>
          <div class="prediction-clock">
            <span>02:55</span>
            <span class="clock-period">5m</span>
            <img src="@/assets/images/clock.svg" alt="">
          </div>
        </v-col>
      </v-row>
      <div class="styled-swiper">
        <swiper
            slidesPerView="auto"
            :spaceBetween="16"
            freeMode
            freeModeSticky
            centeredSlides
            :freeModeMomentumRatio="0.25"
            :freeModeMomentumVelocityRatio="0.5"
            mousewheel
            keyboard
            resizeObserver
            :allowTouchMove="false"
            ref="predictionSlide">
          <swiper-slide v-for="(round,index) in prediction.rounds" :key="'prediction-card_'+index">
            <round :round="round"/>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SetPosition from "@/views/Predictions/SetPosition";
import {predictionMixin, web3Modal} from "@/config/mixins";
import Round from "@/views/Predictions/Round";
import {Swiper, SwiperSlide} from 'vue-awesome-swiper'
import "swiper/swiper.min.css"

export default {
  components: {
    Round,
    SetPosition,
    Swiper,
    SwiperSlide
  },
  computed: {
    ...mapState(['prediction']),
    marketLoading() {
      return this.prediction.marketLoading
    },
    initialIndex() {
      return Math.floor(this.prediction.rounds.length - 4);
    }
  },
  mixins: [web3Modal, predictionMixin],
  data() {
    return {
      timer: null,
      betsTimer: null,
    }
  },
  mounted() {
    this.initData()
    this.$nextTick(async () => {


      this.timer = setInterval(() => {
        this.initData()
      }, 10000)

      this.betsTimer = setInterval(() => {
        this.getBetHistory()
      }, 15000)


      await this.$store.dispatch('getStaticPredictionsData')

    })
  },
  watch: {
    currentEpoch(n, o) {
      this.$nextTick(() => {
        this.$refs.predictionSlide.$swiper.slideTo(this.initialIndex)
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.betsTimer);
  },
  methods: {
    async initData() {
      await this.$store.dispatch('getLatestOraclePrice');
      await this.$store.dispatch('getMarketData');
    },
    async getBetHistory() {
      await this.$store.dispatch('fetchCurrentBets', {
        account: this.web3Modal.account.toLowerCase(),
        roundIds: this.prediction.rounds.filter(round => round.id).map((round) => round.id)
      });
    },
    goPrediction(index = '') {
      if (!index) {
        this.$refs.predictionSlide.$swiper.slideTo(this.initialIndex)
      } else {
        if (index === '+1') this.$refs.predictionSlide.$swiper.slideNext()
        if (index === '-1') this.$refs.predictionSlide.$swiper.slidePrev()
      }
    }
  }
}
</script>

<style lang="scss">
.home-page {
  font-family: Kanit, sans-serif;
  padding: 16px;
  background: linear-gradient(rgb(203, 215, 239) 0%, rgb(154, 159, 208) 100%);

  .col:nth-child(3) {
    display: flex;
    justify-content: flex-end;
  }
}

.coin-balance {
  position: relative;
  overflow: visible;
  background: #ffffff;
  border-radius: 16px;
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 8px 0 40px !important;
  width: fit-content;
  font-size: 12px;
  color: #280d5f;

  img {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
  }

  .coin-title {
    font-weight: bold;
    margin-right: 8px;
    font-size: 16px;
  }
}

.toggle-prediction {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  padding: 4px 8px;
  position: relative;
  background: #ffffff;
  width: fit-content;
  border-radius: 16px;

  i {
    color: #31d0aa !important;
  }

  .v-btn:first-child {
    margin-right: 36px;
  }

  .v-btn:last-child {
    margin-left: 36px;
  }

  img {
    cursor: pointer;
    position: absolute;
    height: 64px;
  }
}

.prediction-clock {
  display: flex;
  align-items: center;
  padding: 8px 48px 8px 16px;
  line-height: 1;
  position: relative;
  border-radius: 20px;
  color: #7645d9;
  font-weight: 700;
  font-size: 18px;
  background: #ffffff;
  width: fit-content;

  .clock-period {
    margin-left: 8px;
    font-size: 12px;
    font-weight: 400;
  }

  img {
    position: absolute;
    right: 0;
    top: 50%;
    width: 64px;
    height: 64px;
    transform: translate(20px, -60%);
  }
}


.styled-swiper {

  * {
    box-sizing: border-box;
  }

  .swiper-wrapper {
    align-items: center;
    display: flex;
  }

  .swiper-container {
    width: 340px;
    overflow: visible !important;
  }

  .swiper-slide {
    width: 340px;
  }
}

</style>