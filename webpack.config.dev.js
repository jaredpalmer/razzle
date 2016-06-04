// jscs:disable
var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');

var getPath = function (dir) {
  return path.join(__dirname, dir);
};

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
    path: getPath('temp'),
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/static/'
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
        test: /\.js$/,
        loader: 'babel',
        query: { presets: ['es2015', 'react', 'stage-0'] },
        include: getPath('src')
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'file',
        query: { limit: 10000, name: '[name].[ext]?[hash]' },
        include: getPath('src')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[ext]?[hash]' },
        include: getPath('src')
      },
    ]
  }
};
