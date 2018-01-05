const path = require('path');
const webpack = require('webpack');
const ClosureCompiler = require('google-closure-compiler-js').webpack;
const relativeToRootPath = './';

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
                    'source-map-loader',
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
                ],
                enforce: 'pre'
            },
        ]
    },
    plugins: [
        // new ClosureCompiler({
        //     options: {
        //         languageIn: 'ECMASCRIPT5',
        //         languageOut: 'ECMASCRIPT5',
        //         compilationLevel: 'ADVANCED',
        //         warningLevel: 'VERBOSE'
        //     }
        // }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
};
