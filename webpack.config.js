const path = require("path");

module.exports = {
    mode: "production",
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        library: "Web3ModalVue",
        umdNamedDefine: true,
        globalObject: "this"
    },
    resolve: {
        extensions: [".js"]
    },
    devtool: "source-map",
};
