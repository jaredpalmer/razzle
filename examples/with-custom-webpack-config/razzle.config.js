'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Change the name of the server output file in production
    if (opts.env.target === 'node' && !opts.env.dev) {
      config.output.filename = 'custom.js';
    }

    return config;
  },
};
