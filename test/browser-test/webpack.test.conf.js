const path = require('path');

module.exports = {
    // entry: {
    //     index: './specs/index.js'
    // },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    devtool: '#inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: {
                    presets: ['env'],
                    plugins: ['babel-plugin-transform-object-assign']
                }
            }
        ]
    }
};
