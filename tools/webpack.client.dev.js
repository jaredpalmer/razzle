const path = require('path')
const webpack = require('webpack')
const CONFIG = require('./webpack.base')

const { CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH } = CONFIG

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-hot-middleware/client',
      CLIENT_ENTRY
    ],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'aphrodite'
    ]
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/',
    path: CLIENT_OUTPUT
  },
  module: {
    rules: [
      {
        // set up standard-loader as a preloader
        test: /\.jsx?$/,
        loader: 'standard-loader',
        exclude: /(node_modules)/,
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules|server)/,
        query: {
          cacheDirectory: true,
          presets: [
            ["env", {
              "targets": {"browsers": ["last 2 versions"]},
              "useBuiltIns": true
            }],
            "react",
            "stage-0"
          ]
        }
      },
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        standard: {
          // config options to be passed through to standard e.g.
          parser: 'babel-eslint'
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: 2 }),
    new webpack.NoErrorsPlugin()
  ],
}
