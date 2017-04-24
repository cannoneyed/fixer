const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development'
// const { ifDevelopment, ifProduction } = getIfUtils(nodeEnv)

module.exports = {
    entry: path.resolve(__dirname, './inject'),

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: [
            '',
            '.js',
            '.jsx',
        ],
    },

    output: {
        filename: 'inject.js',
        path: path.resolve(__dirname, './build'),
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: path.resolve(__dirname, './inject'),
                exclude: [/node_modules/],
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]'),
                include: path.resolve(__dirname, './inject'),
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(nodeEnv),
            },
        }),
        new ExtractTextPlugin('styles.css'),
    ],
}
