'use strict';

module.exports = {
  mediaFolder: ['assets'],
  modify(config, { target, dev }, webpack) {
    if (target === 'node' && !dev) {
      config.output.filename = 'custom.js';
    }

    return config;
  },
};
