'use strict';

const devcert = require('devcert');

const cors = require('cors');

const whitelist = ['https://localhost:3000', 'https://localhost:3001']; //white list consumers
const corsOptions = {
  origin: '*',
  // function (origin, callback) {
  //   console.log(origin);
  //   if (whitelist.indexOf(origin) !== -1) {
  //     callback(null, true);
  //   } else {
  //     callback(null, false);
  //   }
  // },
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'device-remember-token', 'Access-Control-Allow-Origin', 'Origin', 'Accept']
};

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
      // config.devServer.before = function (app, server, compiler) {
      //   app.use(cors('*'));    console.log('web');
      //
      // }
      config.devServer.headers = {
        "Access-Control-Allow-Origin": "*",
        https: true
      }
    }
    return config;
  },
};
