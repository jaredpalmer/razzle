'use strict';
const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin')

module.exports = {
  modify: (config, { target }) => {
    if (target === 'web') {
      return {
        ...config,
        plugins: [
          ...config.plugins,
          new LoadablePlugin({
            writeToDisk: {
              filename: path.resolve('./build/'),
            }
          }),
        ],
      };
    }
  return config;
  }
};
