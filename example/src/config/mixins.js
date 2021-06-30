import {mapGetters, mapState} from "vuex";

const web3Modal = {
    computed: {
        ...mapState(['web3Modal']),
        ...mapGetters(['predictionsContract'])
    },
}
export {
    web3Modal
}