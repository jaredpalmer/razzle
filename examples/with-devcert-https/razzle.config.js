'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const options = opts.webpackOptions;

    return new Promise(async (resolve) => {
      const httpsCredentials = await devcert.certificateFor('localhost');
      if (opts.env.target === 'node' && opts.env.dev) {
        options.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(httpsCredentials);
      }
      if (opts.env.target === 'web' && opts.env.dev) {
        options.HTTPS_CREDENTIALS = httpsCredentials;
      }
      resolve(options);
    });
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    const options = opts.webpackOptions;
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.https = options.HTTPS_CREDENTIALS;
    }
    return config;
  },
};
