const webpack = require('webpack'),
         path = require('path');

const appRoot = path.resolve(__dirname, '..');

function root() {
    var newArgs = Array.prototype.slice.call(arguments, 0);

    return path.join.apply(path, [appRoot].concat(newArgs));
};

const plugins = {
    // https://github.com/webpack-contrib/mini-css-extract-plugin
    MiniCssExtractPlugin: require('mini-css-extract-plugin'),
    // https://github.com/jantimon/html-webpack-plugin
    HtmlWebpackPlugin: require('html-webpack-plugin'),
    // https://www.npmjs.com/package/sass-lint-webpack
    SassLintPlugin: require('sass-lint-webpack')
};

module.exports = function (env) {
    const isProduction = env && env.production;

    const config = {
        mode: isProduction ? 'production' : 'development',

        /**
         * Source map for Karma from the help of karma-sourcemap-loader & karma-webpack.
         *
         * See: https://webpack.js.org/configuration/devtool/
         */
        devtool: isProduction ? false : 'inline-source-map',

        /**
         * Options affecting the resolving of modules.
         *
         * See: https://webpack.js.org/configuration/resolve/
         */
        resolve: {
            /**
             * An array of extensions that should be used to resolve modules.
             *
             * See: https://webpack.js.org/configuration/resolve/#resolve-extensions
             */
            extensions: ['.ts', '.js', '.mjs', '.css', '.scss'],
            modules: [
                root('app'),
                root('app', 'theme'),
                root('node_modules')
            ]
        },

        /**
         * Options affecting the normal modules.
         *
         * See: https://webpack.js.org/configuration/module/
         */
        module: {
            /**
             * An array of Rules which are matched to requests when modules are created.
             *
             * See: https://webpack.js.org/configuration/module/#module-rules
             */
            rules: [{
                test: /\.(woff|woff2|ttf|eot)(\?.*$|$)/,
                use: [{
                    loader: 'file-loader?name=[name].[hash].[ext]',
                    options: {
                        outputPath: 'assets',
                    }
                }]
            }, {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*$|$)/,
                use: [{
                    loader: 'file-loader?name=[name].[hash].[ext]',
                    options: {
                        outputPath: 'assets'
                    }
                }]
            }, {
                test: /\.css$/,
                use: [
                    plugins.MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader'
                    }]
            }]
        },

        plugins: [
            /**
             * Puts each bundle into a file and appends the hash of the file to the path.
             * 
             * See: https://github.com/webpack-contrib/mini-css-extract-plugin
             */
            new plugins.MiniCssExtractPlugin({
                filename: '[name].css'
            }),

            new webpack.LoaderOptionsPlugin({
                options: {
                    htmlLoader: {
                        root: root('app', 'images')
                    },
                    context: '/'
                }
            }),

            new plugins.SassLintPlugin(),
        ],

        devServer: {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            historyApiFallback: true,
        }
    };

    /**
     * The entry point for the bundle. Our Angular app.
     *
     * See: https://webpack.js.org/configuration/entry-context/
     */
    config.entry = {
        'style': './app/style.js',
    };

    if (isProduction) {
        config.output = {
            /**
             * The output directory as absolute path (required).
             *
             * See: https://webpack.js.org/configuration/output/#output-path
             */
            path: root('/build/'),

            publicPath: '',

            /**
             * Specifies the name of each output file on disk.
             *
             * See: https://webpack.js.org/configuration/output/#output-filename
             */
            filename: '[name].js',

            /**
             * The filename of non-entry chunks as relative path inside the output.path directory.
             *
             * See: https://webpack.js.org/configuration/output/#output-chunkfilename
             */
            chunkFilename: '[id].[hash].chunk.js'
        };
    } else {
        config.output = {
            filename: '[name].js',

            /**
             * Set the public path, because we are running the website from another port (5000).
             */
            publicPath: 'http://localhost:2500/'
        };
    }

    config.plugins.push(
        new plugins.HtmlWebpackPlugin({
            hash: true, 
            chunks: ['style'],
            chunksSortMode: 'none', 
            template: 'app/_theme.html'
        })
    );

    if (isProduction) {
        config.module.rules.push({
            test: /\.scss$/,
            /*
             * Extract the content from a bundle to a file.
             * 
             * See: https://github.com/webpack-contrib/extract-text-webpack-plugin
             */
            use: [
                plugins.MiniCssExtractPlugin.loader,
                {
                    loader: 'css-loader'
                }, {
                    loader: 'postcss-loader'
                }, {
                    loader: 'sass-loader'
                }],
            /*
             * Do not include component styles.
             */
            include: root('app', 'theme'),
        });
    } else {
        config.module.rules.push({
            test: /\.scss$/,
            use: [{
                loader: 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader'
            }, {
                loader: 'sass-loader',
                options: {
                    sourceMap: true
                }
            }],
            /*
             * Do not include component styles.
             */
            include: root('app', 'theme')
        });
    }

    return config;
};