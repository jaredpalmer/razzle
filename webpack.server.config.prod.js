// jscs:disable
var webpack = require('webpack')
var fs =  require('fs')
var path = require('path')

function getExternals () {
  var nodeModules = fs.readdirSync(path.resolve(__dirname, 'node_modules'))
  return nodeModules.reduce(function (ext, mod) {
    ext[mod] = 'commonjs ' + mod
    return ext
  }, {})
}

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/server/server.js',
  output: {
    path: path.join(__dirname, '/build/server'),
    filename: 'index.js',
    publicPath: '/static/'
  },
  externals: getExternals(),
  node: {
    __filename: true,
    __dirname: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'src'),
        query: { presets: ['es2015', 'react', 'stage-0'] }
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[ext]?[hash]' }
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[ext]?[hash]' }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install()',
      { raw: true, entryOnly: false }
    ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
