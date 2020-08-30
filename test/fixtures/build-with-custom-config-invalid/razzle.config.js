'use strict';
// Package is not installed in order to simulate bad config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    if (opts.env.target === 'web') {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()];
    }

    return config;
  },
};
