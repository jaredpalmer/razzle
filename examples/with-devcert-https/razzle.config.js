'use strict';

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
    const options = opts.options.razzleOptions;
    if (opts.env.target === 'node' && opts.env.dev) {
      options.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(options.HTTPS_CREDENTIALS);
    }
    return options;
  },
  modifyWebpackConfig(opts) {
    const config = opts.options.webpackConfig;
    const options = opts.options.razzleOptions;
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.https = options.HTTPS_CREDENTIALS;
    }
    return config;
  },
};
