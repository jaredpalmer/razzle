'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    return new Promise((resolve) => {
      setTimeout(() => {
        // Change the name of the server output file in production
        if (opts.env.target === 'node' && !opts.env.dev) {
          config.output.filename = 'custom.js';
        }
        resolve(config);
      }, 10);
    });
  },
};
