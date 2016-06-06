var fs = require('fs')
var path = require('path')
var webpack = require('webpack')

var getPath = function getPath (dir) {
  return path.join(__dirname, dir)
}

var getExternals = function getExternals () {
  var nodeModules = fs.readdirSync(path.resolve(getPath('node_modules')))
  return nodeModules.reduce(function (mapExternals, mod) {
    mapExternals[mod] = 'commonjs ' + mod
    return mapExternals
  }, {})
}

module.exports = {
  target: 'node',
  devtool: 'inline-source-map',
  entry: './src/server/server.js',
  output: {
    path: getPath('/build/server'),
    filename: 'index.js',
    chunkFilename: '[id].[name].[chunkhash].js',
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
        query: { presets: ['es2015', 'react', 'stage-0'] },
        include: getPath('src')
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[hash].[ext]' },
        include: getPath('src')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[hash].[ext]' },
        include: getPath('src')
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    ),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
