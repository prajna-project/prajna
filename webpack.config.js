const path = require('path');
const webpack = require('webpack');
const relativeToRootPath = './';
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: ['./src/polyfill.js', './src/core/index.ts'],
    output: {
        filename: './dist/prajna.js',
        library: 'prajna',
        libraryTarget: 'commonjs2'
    },
    externals: ['cookie'],
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env'],
                                ['babel-preset-es3'],
                                // ['babel-plugin-transform-object-assign']
                            ]
                        }
                    },
                    'awesome-typescript-loader',
                    'source-map-loader',
                ],
                enforce: 'pre'
            },
        ]
    },
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
