/**
 * Adapted from angular2-webpack-starter
 */

const helpers = require('./helpers');
const webpack = require('webpack');

/**
 * Webpack Plugins
 */

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['.ts', '.js', '.css']
    },

    entry: {
        app: ['whatwg-fetch', helpers.root('src/index.ts')]
    },

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: 'index.js',
        library: 'ngx-translate-core',
        libraryTarget: 'umd'
    },

    // require those dependencies but don't bundle them
    externals: [/^@angular\//, /^rxjs\//],

    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts$/,
            loader: 'tslint-loader',
            exclude: [helpers.root('node_modules')]
        }, {
            test: /\.ts$/,
            loader: 'awesome-typescript-loader',
            options: {
                declaration: false
            },
            exclude: [/\.spec\.ts$/]
        },
        {
            test: /\.css$/,
            use: [
                { loader: 'style-loader' },
                { loader: 'css-loader' }
            ]
        }]
    },

    plugins: [
        // fix the warning in ./~/@angular/core/src/linker/system_js_ng_module_factory_loader.js
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            helpers.root('./src')
        ),

        new webpack.LoaderOptionsPlugin({
            options: {
                tslintLoader: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        })
    ]
};
