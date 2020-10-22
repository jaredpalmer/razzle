const path = require('path');
const webpack = require('webpack');
const StartServerPlugin = require('../../SilentPlugin');

const webpackMajorVersion =
  typeof webpack.version !== 'undefined' ? parseInt(webpack.version[0]) : 3;

const is_test = process.env.NODE_ENV == 'test';

module.exports = Object.assign(
  {
    watch: !is_test,
    entry: {main: [__dirname, 'webpack/hot/poll?300', 'webpack/hot/signal']},
    target: 'node',
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new StartServerPlugin({once: is_test, verbose: !is_test}),
    ],
    output: {
      path: path.resolve(__dirname, '..', '..', 'js', 'test-project-hmr'),
      filename: 'server.js',
    },
  },
  webpackMajorVersion !== 3 ? {mode: 'development'} : {}
);
