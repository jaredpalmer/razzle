var path = require('path')
var webpack = require('webpack')

var getPath = function getPath (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: {
    main: [
      'react-hot-loader/patch',
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
    chunkFilename: '[id].[name].js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', 2),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      '__DEV__': true
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react', 'stage-0'],
          plugins: ['transform-runtime']
        },
        include: getPath('src')
      },
      {
        test: /\.(gif|jpe?g|png|ico)$/,
        loader: 'file',
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
  }
}
