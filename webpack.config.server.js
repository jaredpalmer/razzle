const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const StartServerPlugin = require('start-server-webpack-plugin');

module.exports = {
  entry: ['webpack/hot/poll?1000', './server/index'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      whitelist: [
        'webpack/hot/poll?1000',
        /\.(eot|woff|woff2|ttf|otf)$/,
        /\.(svg|png|jpg|jpeg|gif|ico)$/,
        /\.(mp4|mp3|ogg|swf|webp)$/,
        /\.(css|scss|sass|sss|less)$/,
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 20000,
        },
      },
      {
        test: /\.js?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loaders: [
          'babel-loader',
          {
            loader: 'react-svg-loader',
            query: {
              es5: false,
              jsx: true,
              svgo: {
                plugins: [{ removeTitle: false, removeStyleElement: true }],
                floatPrecision: 2,
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new StartServerPlugin('server.js'),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_TARGET: JSON.stringify('server'),
      },
    }),
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js',
  },
};
