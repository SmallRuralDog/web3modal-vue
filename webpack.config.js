var path = require('path')
var merge = require('webpack-merge')

module.exports = merge.smart(require(path.resolve(__dirname, './conf/webpack.js')), {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: path.resolve(__dirname, './dist'),
        filename: 'web3-modal-vue.js'
    }
})