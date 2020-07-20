# Razzle Single Exposed Port Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example with-single-exposed-port with-single-exposed-port

cd with-single-exposed-port
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

Visit http://localhost:3001/ in the browser.

## Idea behind the example
This example demonstrates how to use a `razzle.config.js` file to modify Razzle's
underlying webpack devServer configuration to proxy the devServer to the express server.
It modifies the proxy of the devServer in dev (`razzle start`).

Note that this file is not transpiled, and so you must write it with vanilla
Node.js-compatible JavaScript.

```js
// razzle.config.js
'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    if (target === 'web' && dev) {
      appConfig.devServer.proxy = {
        context: () => true,
        target: 'http://localhost:3000'
      };
      appConfig.devServer.index = '';
    }

    return appConfig;
  },
};
```
