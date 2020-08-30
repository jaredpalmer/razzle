'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    if (opts.env.target === 'node' && !opts.env.dev) {
      config.output.filename = 'custom.js';
    }

    return config;
  },
};
