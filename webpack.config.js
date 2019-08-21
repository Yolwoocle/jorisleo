const path = require('path');

module.exports = {
    mode: 'development',
    entry: './client/main.js',
    devtool: 'source-map', 
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 3000
    },
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
    }
};