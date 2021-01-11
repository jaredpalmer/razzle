'use strict';

const path = require('path');
const { StatsWriterPlugin } = require("webpack-stats-plugin")

module.exports = {
  modifyPaths(opts) {
    const paths = opts.paths;
    paths.appServerJs = path.join(paths.appPath, 'src/cli.server');
    paths.appServerIndexJs = path.join(paths.appPath, 'src/index.server');
    paths.appClientIndexJs = path.join(paths.appPath, 'src/index.client');
    return paths;
  },
  modifyWebpackOptions(opts) {
    const options = opts.options.webpackOptions;

    // Enable HtmlWebpackPlugin in iso app
    if (opts.env.target === 'web') {
      options.enableHtmlWebpackPlugin = true;
    }

    return options;
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Enable StatsWriterPlugin
    if (opts.env.target === 'web') {
      config.plugins = config.plugins.concat([
        // Write out stats file to build directory.
        new StatsWriterPlugin({
          filename: "../stats.json" // Default
        })
      ]);
    }

    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.writeToDisk = true;
    }

    return config;
  },
}
