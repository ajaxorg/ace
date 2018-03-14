"use strict";

module.exports = {
    mode: 'development',
    entry: "./demo.js",
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    node: {
        global: false,
        process: false,
        Buffer: false,
        __filename: "mock",
        __dirname: "mock",
        setImmediate: false
    },
    module: {
    },
    resolve: {
    },
    devServer: {
        contentBase: __dirname,
        compress: true,
        port: 9000
    }
};