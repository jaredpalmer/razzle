const path = require('path')
const webpack = require('webpack')
const CONFIG = require('./webpack.base')

const { CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH } = CONFIG

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
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
    publicPath: PUBLIC_PATH,
    path: CLIENT_OUTPUT
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', 2),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    })
  ],
  module: {
    preLoaders: [
      {
        // set up standard-loader as a preloader
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components|server)/,
        query: {
          cacheDirectory: true,
          presets: ["es2015", "react", "stage-0"]
        }
      },
      // {
      //   test: /\.txt$/,
      //   loader: 'raw',
      //   exclude: /(node_modules|bower_components)/
      // },
      // {
      //   test: /\.json$/,
      //   loader: 'json',
      //   exclude: /(node_modules|bower_components)/
      // },
      // {
      //   test: /\.(gif|jpe?g|png|ico)$/,
      //   loader: 'url',
      //   query: { limit: 10000, name: '[name].[hash:8].[ext]' },
      //   include: CLIENT_ENTRY
      // },
      // {
      //   test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
      //   loader: 'url',
      //   query: { limit: 10000, name: '[name].[hash:8].[ext]' },
      //   include: CLIENT_ENTRY
      // }
    ]
  },
  standard: {
    // config options to be passed through to standard e.g.
    parser: 'babel-eslint'
  }
}
