module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/web3modal-vue/'
        : '/',
    outputDir: "../docs"
}