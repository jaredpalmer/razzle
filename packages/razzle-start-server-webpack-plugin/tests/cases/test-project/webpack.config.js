const path = require('path');
const webpack = require('webpack');
const StartServerPlugin = require('../../SilentPlugin');

const webpackMajorVersion =
  typeof webpack.version !== 'undefined' ? parseInt(webpack.version[0]) : 3;

const is_test = process.env.NODE_ENV == 'test';

module.exports = Object.assign(
  {
    watch: !is_test,
    entry: {main: __dirname},
    target: 'node',
    plugins: [new StartServerPlugin({once: true, verbose: !is_test})],
    output: {
      path: path.resolve(__dirname, '..', '..', 'js', 'test-project'),
      filename: 'server.js',
    },
  },
  webpackMajorVersion !== 3 ? {mode: 'development'} : {}
);
