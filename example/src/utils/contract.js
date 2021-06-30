import predictionsAbi from '../config/abi/predictions.json'
import chainLinkOracleAbi from '../config/abi/oracle.json'
import {ethers} from "ethers";
import {simpleRpcProvider} from "@/utils/web3";
import store from '@/store'

export const getPredictionsContract = () => {

    const {library} = store.state.web3Modal
    const signer = library.getSigner()
    return getContract(predictionsAbi, process.env.VUE_APP_PREDICTION_CONTRACT_ADDRESS, signer)
}

export const getOracleContract = () => {
    return getContract(chainLinkOracleAbi, process.env.VUE_APP_PREDICTION_ORACLE_ADDRESS)
}

const getContract = (abi, address, signer = null) => {

    const signerOrProvider = signer ?? simpleRpcProvider
    return new ethers.Contract(address, abi, signerOrProvider)
}