# Razzle Custom Webpack Configuration Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->Create and start the example:

```bash
npx create-razzle-app --example with-custom-webpack-config with-custom-webpack-config

cd with-custom-webpack-config
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This example demonstrates how to use a `razzle.config.js` file to modify Razzle's
underlying webpack configuration. It modifies the name of the server's output file
in production (`razzle build`).

Note that this file is not transpiled, and so you must write it with vanilla
Node.js-compatible JavaScript.

```js
// razzle.config.js
'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Change the name of the server output file in production
    if (opts.env.target === 'node' && !opts.env.dev) {
      config.output.filename = 'custom.js';
    }

    return config;
  },
};
```
