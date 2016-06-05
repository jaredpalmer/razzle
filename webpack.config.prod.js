// jscs:disable
var path = require('path')
var webpack = require('webpack')
var AssetsPlugin = require('assets-webpack-plugin')

var getPath = function getPath (dir) {
  return path.join(__dirname, dir)
}

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
    path: getPath('/build/static'),
    filename: '[name]_[hash].js',
    chunkFilename: '[id].chunk_[hash].js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash].js',  2),
    new webpack.optimize.DedupePlugin(),
    new AssetsPlugin({ filename: 'assets.json' }),
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
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
          plugins: [
            'transform-react-constant-elements',
            'transform-react-inline-elements'
          ]
        },
        include: getPath('src')
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[ext]?[hash]' },
        include: getPath('src')
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2).*$/,
        loader: 'url',
        query: { limit: 10000, name: '[name].[ext]?[hash]' },
        include: getPath('src')
      }
    ]
  }
}
