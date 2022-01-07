'use strict';
const devcert = require('devcert');

module.exports = {
  modifyOptions(opts) {
    // use modifyOptions so certificateFor is called once
    const options = opts.options.razzleOptions;
    return new Promise(async resolve => {
      const httpsCredentials = await devcert.certificateFor('localhost');
      const stringHttpsCredentials = {
        key: httpsCredentials.key.toString(),
        cert: httpsCredentials.cert.toString(),
      };
      options.HTTPS_CREDENTIALS = stringHttpsCredentials;
      resolve(options);
    });
  },
  modifyWebpackOptions(opts) {
    const razzleOptions = opts.options.razzleOptions;
    const webpackOptions = opts.options.webpackOptions;
    if (opts.env.target === 'node' && opts.env.dev) {
      webpackOptions.definePluginOptions.HTTPS_CREDENTIALS = JSON.stringify(
        razzleOptions.HTTPS_CREDENTIALS
      );
    }
    return webpackOptions;
  },
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // Do some stuff to webpackConfig
    // DevCert配置
    {
      if (target === 'web' && dev) {
        webpackConfig.devServer.https = razzleOptions.HTTPS_CREDENTIALS;
        webpackConfig.devServer.headers = {
          'Access-Control-Allow-Origin': '*',
          https: true,
        };
      }
    }
    return webpackConfig;
  },
};
