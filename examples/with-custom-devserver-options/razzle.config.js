'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    if (target === 'web' && dev) {
      appConfig.devServer.port = 3002;
      // If behind a proxy on a public domain
      // appConfig.devServer.public = 'example.com:8080';
    }

    return appConfig;
  },
};
