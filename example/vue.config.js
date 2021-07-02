module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    publicPath: process.env.NODE_ENV === 'production'
        ? '/web3modal-vue/'
        : '/',
    outputDir: "../docs",
    css: {
        loaderOptions: {
            scss: {
                additionalData: '@import "@/style/main.scss";'
            }
        }
    },
    transpileDependencies: [
        'vuetify'
    ]
}
