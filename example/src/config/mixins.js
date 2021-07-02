import {mapGetters, mapState} from "vuex";
import {getMultiplier} from "@/utils/helpers";

const web3Modal = {
    computed: {
        ...mapState(['web3Modal']),
        ...mapGetters(['predictionsContract'])
    },
    active() {
        return this.web3Modal.active
    }
}

const predictionMixin = {
    computed: {
        ...mapState(['prediction']),
        currentEpoch() {
            return this.prediction.market.epoch
        },
        bullMultiplier() {
            return getMultiplier(this.round.totalAmount, this.round.bullAmount)
        },
        bearMultiplier() {
            return getMultiplier(this.round.totalAmount, this.round.bearAmount)
        },
        bet() {
            const {account} = this.$store.state.web3Modal
            const {bets} = this.prediction
            const roundId = this.round.id

            if (!bets[account]) {
                return null
            }
            if (!bets[account][roundId]) {
                return null
            }
            return this.prediction.bets[account][roundId]
        },
        hasEntered() {
            return this.bet !== null
        },
        hasEnteredUp() {
            return this.hasEntered && this.bet.position === "Bull"
        },
        hasEnteredDown() {
            return this.hasEntered && this.bet.position === "Bear"
        }
    }
}

export {
    web3Modal,
    predictionMixin
}