var webpack = require('webpack');

module.exports = {
  entry: './src/client.js',

  output: {
    path: 'public',
    filename: 'bundle.js',
    publicPath: '/',
  },

  plugins: process.env.NODE_ENV === 'production' ? [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
  ] : [],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
      },
    ],
  },
};
