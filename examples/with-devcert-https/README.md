# Razzle Devcert Https Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example with-devcert-https with-devcert-https

cd with-devcert-https
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This example demonstrates how to use a `razzle.config.js` file to modify Razzle's
underlying configuration using a promise. It modifies the name of the server's output file
in production (`razzle build`).

Note that this file is not transpiled, and so you must write it with vanilla
Node.js-compatible JavaScript.

```js
// razzle.config.js
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

```
