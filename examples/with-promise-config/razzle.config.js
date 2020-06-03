'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    return new Promise((resolve) => {
      setTimeout(() => {
        // Change the name of the server output file in production
        if (target === 'node' && !dev) {
          appConfig.output.filename = 'custom.js';
        }
        resolve(appConfig);
      }, 10);
    });
  },
};
