'use strict';

const devcert = require('devcert');

module.exports = {
  modifyOptions(opts) { // use modifyOptions so certificateFor is called once
    const options = opts.options.razzleOptions;
    return new Promise(async (resolve) => {
      const httpsCredentials = await devcert.certificateFor('localhost');
      const stringHttpsCredentials = {
        key: httpsCredentials.key.toString(),
        cert: httpsCredentials.cert.toString()
      };
      options.HTTPS_CREDENTIALS = stringHttpsCredentials;
      resolve(options);
    });
  },
  modifyWebpackOptions(opts) {
    const razzleOptions = opts.options.razzleOptions;
    const webpackOptions = opts.options.webpackOptions;
    if (opts.env.target === 'node' && opts.env.dev) {
      webpackOptions.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(razzleOptions.HTTPS_CREDENTIALS);
    }
    return webpackOptions;
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    const options = opts.options.razzleOptions;
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.https = options.HTTPS_CREDENTIALS;
    }
    return config;
  },
};
