'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    if (target === 'node' && !dev) {
      config.output.filename = 'custom.js';
    }

    return config;
  },
};
