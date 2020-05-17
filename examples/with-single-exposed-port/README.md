# Razzle Single Exposed Port Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-single-exposed-port
cd with-single-exposed-port
```

Install it and run:

```bash
yarn install
yarn start
```

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
