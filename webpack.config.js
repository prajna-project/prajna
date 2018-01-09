const path = require('path');
const webpack = require('webpack');
const version = require('./package.json').version;
const relativeToRootPath = './';

module.exports = {
    entry: ['./src/polyfill.js', './src/core/index.ts'],
    output: {
        filename: `./dist/prajna.${version}.js`,
        library: 'Prajna',
        libraryTarget: 'umd'
    },
    externals: ['cookie'],
    devtool: 'source-map',
    resolve: {
        extensions: ['.webpack.js', '.ts', '.js'],
        modules: ['node_modules']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [
                    'source-map-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['env']
                            ]
                        }
                    },
                    'awesome-typescript-loader',
                ],
                enforce: 'pre'
            },
        ]
    },
    performance: {
        hints: 'warning',
        maxAssetSize: 102400,    // 100kb
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
