// jscs:disable
var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    main: [
      'webpack/hot/only-dev-server',
      'webpack-hot-middleware/client',
      './src/client.js'
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
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', 2),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url-loader?limit=1000',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url-loader?limit=1000',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
    ]
  }
};
