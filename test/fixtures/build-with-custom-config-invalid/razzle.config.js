'use strict';
// Package is not installed in order to simulate bad config
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = {
  modify(config, { target }) {
    if (target === 'web') {
      config.plugins = [...config.plugins, new BundleAnalyzerPlugin()];
    }

    return config;
  },
};
