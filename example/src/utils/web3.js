import Web3 from "web3"

const httpProvider = new Web3.providers.HttpProvider(process.env.VUE_APP_RPC_URL)


const web3NoAccount = new Web3(httpProvider)

const getWeb3NoAccount = () => {
    return web3NoAccount
}
export {getWeb3NoAccount}
export default web3NoAccount