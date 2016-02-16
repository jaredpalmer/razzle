// jscs:disable
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: ['./src/client.js'],
    editor: ['./src/routes/Editor'],
    post: ['./src/routes/Post'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js', 2),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
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
