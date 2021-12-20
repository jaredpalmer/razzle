'use strict';

const path = require('path');

module.exports = {
  options: {
    buildType: 'iso-serverless'
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    if (opts.env.target === 'node') {
      config.plugins.push(
        new opts.webpackObject.ContextReplacementPlugin(
                                             // we want to replace context
          /express\/lib/,                    // and replace all searches in
                                             // express/lib/*
          path.resolve('node_modules'),      // to look in folder 'node_modules'
          {                                  // and return a map
            'ejs': 'ejs'                     // which resolves request for 'ejs'
          }                                  // to module 'ejs'
        )                                    // __webpack_require__(...)(mod)
        // we set `mod = 'ejs'`
      )
    }
    return config;
  }
};
