# Razzle Devcert Https Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example with-promise-config with-promise-config

cd with-promise-config
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
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    return new Promise((resolve) => {
      setTimeout(() => {
        // Change the name of the server output file in production
        if (opts.env.target === 'node' && !opts.env.dev) {
          config.output.filename = 'custom.js';
        }
        resolve(config);
      }, 10);
    });
  },
};

```
