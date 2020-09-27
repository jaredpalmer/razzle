'use strict';

const Prefresh = require('@prefresh/webpack');

module.exports = {
  modify(config, { target, dev }, webpack) {
    if (target !== 'node' && dev) {
      const babelLoader = config.module.rules.find(loaderEntry =>
        String(loaderEntry.test).includes('(js|jsx|mjs)')
      );
      if (babelLoader.use[0].options.plugins) {
        babelLoader.use[0].options.plugins.unshift('@prefresh/babel-plugin');
      } else {
        babelLoader.use[0].options.plugins = ['@prefresh/babel-plugin'];
      }

      config.plugins.unshift(new Prefresh());
    }

    return config;
  },
};
