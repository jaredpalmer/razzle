# Razzle Custom Webpack Configuration Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-custom-devserver-options with-custom-devserver-options

cd with-custom-devserver-options
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This example demonstrates how to use a `razzle.config.js` file to modify Razzle's
underlying webpack devServer configuration. It modifies the port of the devServer
in dev (`razzle start`).

Note that this file is not transpiled, and so you must write it with vanilla
Node.js-compatible JavaScript.

```js
// razzle.config.js
'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;
    if (opts.env.target === 'web' && opts.env.dev) {
      config.devServer.port = 3002;
      // If behind a proxy on a public domain
      // config.devServer.public = 'example.com:8080';
    }

    return config;
  },
};
```
