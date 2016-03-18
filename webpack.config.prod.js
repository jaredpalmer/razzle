// jscs:disable
var path = require('path');
var webpack = require('webpack');
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
  devtool: false,
  entry:  {
    main: ['./src/client.js'],
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
     path: __dirname + '/build/static',
     filename: '[name]_[hash].js',
     chunkFilename: '[id].chunk_[hash].js',
     publicPath: '/build/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash].js',  2),
    new webpack.optimize.DedupePlugin(),
    new AssetsPlugin({filename: 'assets.json'}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true,
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      '__DEV__': false,
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
      include: path.join(__dirname, 'src')
    }]
  }
};
