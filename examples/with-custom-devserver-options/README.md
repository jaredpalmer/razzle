# Razzle Custom Webpack Configuration Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-custom-devserver-options
cd with-custom-webpack-config
```

Install it and run:

```bash
yarn install
yarn start
```

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
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    if (target === 'web' && dev) {
      appConfig.devServer.port = 3002;
      // If behind a proxy on a public domain
      // appConfig.devServer.public = 'example.com:8080';
    }

    return appConfig;
  },
};



```
