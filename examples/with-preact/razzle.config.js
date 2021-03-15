'use strict';

const Prefresh = require('@prefresh/webpack');

module.exports = {
  experimental: {
    reactRefresh: false,
  },
  modifyWebpackConfig(opts) {
    const { target, dev } = opts.env;
    const { webpackConfig: config } = opts;
    if (target !== 'node' && dev) {
      const jsRule = config.module.rules.find(loaderEntry =>
        String(loaderEntry.test).includes('(js|jsx|mjs|ts|tsx)')
      );

      const babelLoader = jsRule.use.find(useEntry =>
        useEntry.loader.includes('babel-loader')
      );

      if (babelLoader.options.plugins) {
        babelLoader.options.plugins.unshift('@prefresh/babel-plugin');
      } else {
        babelLoader.options.plugins = ['@prefresh/babel-plugin'];
      }

      config.plugins.unshift(new Prefresh());
    }

    return config;
  },
};