'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultOptions = {
  target: 'web',
  env: 'production',
  bundleAnalyzerConfig: {},
};

module.exports = {
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);

    const options = Object.assign(
      {},
      defaultOptions,
      opts.options.pluginOptions
    );
    
    if (opts.env.target === options.target && options.env !== 'production' === opts.env.dev) {
      config.plugins.push(
        new BundleAnalyzerPlugin(
          Object.assign({}, defaultOptions.bundleAnalyzerConfig, options.bundleAnalyzerConfig)
        )
      );
    }

    return config;
  },
};
