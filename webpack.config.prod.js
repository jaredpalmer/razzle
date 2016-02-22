// jscs:disable
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry:  {
    main: ['./src/client.js'],
    editor: ['./src/routes/Edit'],
    post: ['./src/routes/Post'],
  },
  output: {
     path: __dirname + '/build/static',
     filename: '[name].js',
     chunkFilename: '[id].chunk.js',
     publicPath: '/build/static/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('common.js',  2),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
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
