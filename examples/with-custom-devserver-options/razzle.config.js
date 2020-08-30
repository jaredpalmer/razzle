'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.port = 3002;
      // If behind a proxy on a public domain
      // config.devServer.public = 'example.com:8080';
    }

    return config;
  },
};
