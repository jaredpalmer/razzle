'use strict';
const path = require('path');
module.exports = {
  modify(config, { target, dev }) {
    const appConfig = config; // stay immutable here

    if (target === 'node' && !dev) {
      appConfig.entry = path.resolve(__dirname, './src/server.js');
      appConfig.output.filename = 'server.bundle.js';
      appConfig.output.path = path.resolve(__dirname, './server/build');
      appConfig.output.libraryTarget = 'commonjs2';
    }

    return appConfig;
  },
};
