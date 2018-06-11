# Razzle Custom Webpack Configuration Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-custom-webpack-config
cd with-custom-webpack-config
```

Install it and run:

```bash
yarn install
yarn start
```

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
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    // Change the name of the server output file in production
    if (target === 'node' && !dev) {
      appConfig.output.filename = 'custom.js';
    }

    return appConfig;
  },
};
```
