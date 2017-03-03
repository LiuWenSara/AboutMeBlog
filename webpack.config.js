var webpack = require('webpack');
module.exports = {
    entry: [
        './public/javascripts/entry.js'
    ],
    output: {
        path: __dirname + '/public/',
        publicPath: "/public/",
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }]
    }
};