'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    if (target === 'web' && dev) {
      appConfig.devServer.proxy = {
        context: () => true,
        target: 'http://localhost:3000'
      };
      appConfig.devServer.index = '';
    }

    return appConfig;
  },
};
