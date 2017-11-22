const path = require('path');
const GadgetPlugin = require('@dp/prajna-gadget-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function getHTMLPath(fName) {
    return path.resolve(__dirname, `contextHTML/${fName}`);
}

module.exports = {
    entry: {
        coustomContext: getHTMLPath('customContext.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'context.html',
            inject: false,
            template: getHTMLPath('context.html')
        }),
        new HtmlWebpackPlugin({
            filename: 'debug.html',
            inject: false,
            template: getHTMLPath('debug.html')
        }),
        new GadgetPlugin({
            includes: [getHTMLPath('context.html'), getHTMLPath('debug.html')],
            prajnaOptions: {
                autopv: true,
                env: 'product',
                project: 'prajna-browser-test',
		thirdParty: {
                    category: 'lx-prajna-test',
                    forbidLX4: false,
		    catFallback: true,
		    lingxiFallback: true,
		},
            }
        })
    ]
};
