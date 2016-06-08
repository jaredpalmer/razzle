const path = require('path')
const webpack = require('webpack')
const AssetsPlugin = require('assets-webpack-plugin')

const CONFIG = require('./webpack.base')
const { CLIENT_ENTRY, CLIENT_OUTPUT, PUBLIC_PATH } = CONFIG

module.exports = {
  devtool: false,
  entry: {
    main: [CLIENT_ENTRY],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'redux',
      'react-redux',
      'aphrodite'
    ],
  },
  output: {
    filename: '[name]_[hash].js',
    chunkFilename: '[name]_[hash].chunk.js',
    publicPath: PUBLIC_PATH,
    path: CLIENT_OUTPUT
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', 2),
    new AssetsPlugin({
      // path: path.join(__dirname, '../build'),
      filename: 'assets.json'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ["es2015", "react", "stage-0"]
        },
        exclude: /(node_modules|bower_components)/
      },
      // {
      //   test: /\.txt$/,
      //   loader: 'raw',
      //   include: CLIENT_ENTRY
      // },
      // {
      //   test: /\.json$/,
      //   loader: 'json',
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
  }
}
