// jscs:disable
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: {
    main: './src/client.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    // new webpack.optimize.CommonsChunkPlugin('common.js', 2),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
      include: path.join(__dirname, 'src')
    }]
  }
};
