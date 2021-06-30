import web3NoAccount from "@/utils/web3";
import predictionsAbi from '../config/abi/predictions.json'

export const getPredictionsContract = (web3) => {
    return getContract(predictionsAbi, process.env.VUE_APP_PREDICTION_CONTRACT_ADDRESS, web3)
}

const getContract = (abi, address, web3, account = null) => {
    const _web3 = web3 ?? web3NoAccount
    const gasPrice = "5"
    return new _web3.eth.Contract(abi, address, {
        gasPrice: gasPrice
    })
}