'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    // Change the name of the server output file in production
    if (target === 'node' && !dev) {
      appConfig.output.filename = 'custom.js';
    }

    return appConfig;
  },
};
