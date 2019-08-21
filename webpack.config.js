const path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './client/main.js',
    devtool: 'source-map', 
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true, 
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './dist']
            }
        })
    ]
};