var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
.filter(function (x) {
  return ['.bin'].indexOf(x) === -1;
})
.forEach(function (mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

module.exports = {

  entry: path.resolve(__dirname, 'src/server/server.js'),

  output: {
    filename: 'server.bundle.js',
    path: './dist',
  },

  target: 'node',

  // keep node_module paths out of the bundle
  externals: nodeModules,

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0',
      },
    ],
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.BannerPlugin('require("source-map-support").install();',
      { raw: true, entryOnly: false }),
  ],
};
