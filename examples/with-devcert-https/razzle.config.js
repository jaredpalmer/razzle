'use strict';

module.exports = {
  modifyWebpackOptions(opts) {
    const options = opts.webpackOptions;
    return new Promise(async (resolve) => {
      const httpsCredentials = await devcert.certificateFor('localhost');
      const stringHttpsCredentials = {
        key: httpsCredentials.key.toString(),
        cert: httpsCredentials.cert.toString()
      };
      if (opts.env.target === 'node' && opts.env.dev) {
        options.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(stringHttpsCredentials);
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
