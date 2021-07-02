<template>
  <div>
    <open-round-card
        v-if="round.epoch === currentEpoch && round.lockPrice === null"
        :round="round"
        :bear-multiplier="bearMultiplier"
        :bull-multiplier="bullMultiplier"
        :bet-amount="bet?bet.amount:null"
        :has-entered-down="hasEnteredDown"
        :has-entered-up="hasEnteredUp"
        :has-entered="hasEntered"
    />
    <live-round-card
        v-else-if="round.epoch === currentEpoch - 1 && round.closePrice === null"
        :round="round"
        :bear-multiplier="bearMultiplier"
        :bull-multiplier="bullMultiplier"
        :bet-amount="bet?bet.amount:null"
        :has-entered-down="hasEnteredDown"
        :has-entered-up="hasEnteredUp"
        :has-entered="hasEntered"
    />
    <soon-round-card
        v-else-if="round.epoch > currentEpoch"
        :round="round"
    />
    <expired-round-card
        v-else
        :round="round"
        :bear-multiplier="bearMultiplier"
        :bull-multiplier="bullMultiplier"
        :bet-amount="bet?bet.amount:null"
        :has-entered-down="hasEnteredDown"
        :has-entered-up="hasEnteredUp"
        :has-entered="hasEntered"
        :bet="bet"
    />
  </div>
</template>

<script>
import {predictionMixin, web3Modal} from "@/config/mixins";
import OpenRoundCard from "@/views/Predictions/Components/OpenRoundCard";
import LiveRoundCard from "@/views/Predictions/Components/LiveRoundCard";
import ExpiredRoundCard from "@/views/Predictions/Components/ExpiredRoundCard";
import SoonRoundCard from "@/views/Predictions/Components/SoonRoundCard";

export default {
  name: "Round",
  components: {SoonRoundCard, ExpiredRoundCard, LiveRoundCard, OpenRoundCard},
  props: ['round'],
  mixins: [web3Modal, predictionMixin],
  mounted() {

  },
  methods: {}
}
</script>

<style lang="scss">
$flip_time: 0.3s;
$flip_timing_function: ease-out;

.prediction-com {
  position: relative;
  width: 320px;
  height: 374px;
  min-height: 358px;
  perspective: 800px;
  font-family: Kanit, sans-serif;
  overflow: visible;
}

.card-flipped {
  transform: rotateY(180deg);

  .guess-panel {
    opacity: 1 !important;
  }

  .prediction-panel {
    opacity: 0 !important;
  }
}

.prediction-expired {
  opacity: 0.625;

  .card-header {
    background: #e7e3eb;

    &, i {
      color: #9ea1a2;
    }
  }
}

.prediction-live {

  .card-header {
    padding: 16px 16px 12px !important;

    .header-left {
      font-weight: bold;
      font-size: 18px !important;

      i {
        font-size: 23px !important;
      }
    }

    &, i {
      color: #7645d9 !important;
    }
  }
}

.prediction-next {
  .card-header {
    background: #7645d9;

    &, i {
      color: #ffffff !important;
    }
  }
}

.prediction-later {

  .card-header {
    background: #e7e3eb;
  }

  &, i {
    color: #280d5f !important;
  }

  .up-area, .down-area {
    svg {
      color: #e4e9eb !important;
    }

    .area-title {
      color: #BDC2C4 !important;
    }
  }
}

.prediction-calculating {

  .up-area, .down-area {
    svg {
      color: #e4e9eb !important;
    }

    .area-title {
      color: #BDC2C4 !important;
    }
  }
}

.prediction-card {
  width: 100%;
  height: 100%;
  position: absolute;
  transform-style: preserve-3d;
  transition: transform $flip_time;
  transition-timing-function: $flip_timing_function;
  user-select: none;
  display: flex;
  flex-direction: column;
  overflow: visible;

  &:hover {
    opacity: 1;
  }

  .prediction-panel {
    opacity: 1;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: opacity 0.3s, transform $flip_time;
    transition-timing-function: $flip_timing_function;
    backface-visibility: hidden;
    background-color: #f8f8f9;
    box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
    overflow: hidden;
    border-radius: 16px;
  }

  .guess-panel {
    opacity: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    transition: opacity 0.3s, transform $flip_time;
    transition-timing-function: $flip_timing_function;
    transform: rotateY(180deg);
    background-color: #f8f8f9;
    backface-visibility: hidden;
    box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -8px, rgb(25 19 38 / 5%) 0px 1px 1px;
    overflow: hidden;
    border-radius: 16px;

    .guess-header {
      padding: 8px;
      font-weight: bold;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(111.68deg, rgb(242, 236, 242) 0%, rgb(232, 242, 246) 100%);

      .header-left {
        display: flex;
        align-items: center;
      }

      .header-right {
        height: unset;
        min-height: unset;
        border-radius: 4px;
        font-size: 14px !important;
        font-weight: 500;
        display: flex;
        align-items: center;
        padding: 4px 8px;

        &, i {
          color: #ffffff !important;
        }
      }
    }

    .guess-content {
      display: flex;
      flex-direction: column;
      padding: 16px;

      .amount-label {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .coin-logo {
          display: flex;
          align-items: center;
          font-weight: bold;

          img {
            height: 24px;
            margin-right: 4px;
          }
        }
      }

      .amount-input {
        padding: 8px 16px;
        border-radius: 16px;
        background-color: rgb(238, 234, 244);
        border: 1px solid rgb(215, 202, 236);
        box-shadow: rgb(74 74 104 / 10%) 0 2px 2px -1px inset;
        font-size: 18px;
        height: 56px;
        outline: none;
        margin: 8px 0;
        text-align: right;
        font-weight: bold;

        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }

      .amount-balance {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .amount-slide {
        margin-bottom: 8px;
      }

      .amount-radio {
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .per-radio {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 8px;
          height: 20px;
          border-radius: 16px;
          background: #e9edee;
          color: #1fc7d4;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
        }
      }

      .guess-btn {
        margin-bottom: 8px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 24px;
        height: 48px;
        background: #1fc7d4;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
        cursor: pointer;
        box-shadow: rgb(25 19 38 / 10%) 0px 2px 12px -5px, rgb(25 19 38 / 5%) 0px 2px 2px;
      }

      .guess-intro {
        font-weight: bold;
        font-size: 12px;
        color: #7a6eaa;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;

    .header-left {
      font-size: 16px;
      display: flex;
      align-items: center;
    }

    .header-right {
      font-size: 14px;
    }
  }

  .card-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;

    .enter-btn {
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: rgb(14 14 44 / 40%) 0px -1px 0px 0px inset;
      font-size: 18px;
      font-weight: bold;
      min-height: 48px;
      color: #ffffff;
      transition: all 0.16s;

      &:active {
        box-shadow: rgb(14 14 44 / 40%) 0 0 0 0 inset;
      }
    }

    .calculating-panel {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;

      .cake-img {
        position: absolute;
        top: -4px;
        left: calc(50% - 42px);
        height: 42px;
        animation: rotateCalculating 2s linear infinite;
      }

      @keyframes rotateCalculating {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .stall-img {
        height: 90px;
        animation: 6s ease-in-out 0s infinite normal none running jump;
        transform: translateY(-5px);

        @keyframes jump {
          0%, 100% {
            transform: translateY(-5px);
          }

          50% {
            transform: translateY(5px);
          }
        }
      }

      .calculating-area {
        margin-top: 4px;
        display: flex;
        align-content: center;
        justify-content: center;
        font-weight: bold;
        position: relative;

        &, i {
          color: #280d5f !important;
        }

        &::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 2px;
          right: 25px;
          border-bottom: 2px dotted currentColor;
        }
      }
    }

    .later-title {
      text-align: center;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 4px;
    }

    .later-time {
      font-weight: bold;
      text-align: center;
      font-size: 24px;
    }

    .up-area, .down-area {
      height: 60px;
      width: 220px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;

      svg {
        position: absolute;
        color: #dfe5ef;
      }

      .area-info {
        z-index: 1;
        font-size: 12px;
      }

      .area-title {
        z-index: 1;
        font-size: 18px;
        font-weight: bold;
      }
    }

    .up-area {
      border-radius: 20px 20px 0 0;

      svg {
        bottom: 0.5px;
      }
    }

    .down-area {
      border-radius: 0 0 20px 20px;

      svg {
        top: 0.5px;
      }
    }

    .up-activited {
      svg {
        color: #31d0aa;
      }

      .area-title, .area-info {
        color: #ffffff !important;
      }
    }

    .down-activited {
      svg {
        color: #ed4b9e;
      }

      .area-title, .area-info {
        color: #ffffff !important;
      }
    }

    .info-up {
      border-color: #31d0aa !important;
    }

    .info-down {
      border-color: #ed4b9e !important;
    }

    .card-info {
      width: 100%;
      background: rgb(255, 255, 255);
      border-radius: 14px;
      border: 2px solid rgb(122, 110, 170);
      padding: 16px;
      display: flex;
      flex-direction: column;

      .info-title {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 8px;
        color: rgba(122, 110, 170, 1);
      }

      .price-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;

        .price-text {
          font-size: 24px;
          font-weight: bold;
        }

        .rate-text {
          border-radius: 4px;
          padding: 4px 8px;
          color: #ffffff;
          display: flex;
          align-items: center;
        }
      }

      .locked-price {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
      }

      .prize-pool {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        font-size: 14px;
      }
    }
  }

  .fc-red {
    color: #ed4b9e;
  }

  .fc-green {
    color: #31d0aa;
  }

  .bg-red {
    background: #ed4b9e !important;
  }

  .bg-green {
    background: #31d0aa !important;
  }
}
</style>