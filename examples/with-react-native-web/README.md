# Razzle React Native Web Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-react-native-web
cd with-react-native-web
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This example demonstrates how to use [React Native Web](https://github.com/necolas/react-native-web) with Razzle. Relative to the basic Razzle example, there are some noteworthy modifications. First, we add `react-native-web` to dependencies and `babel-plugin-react-native-web` to dev dependencies.

```
yarn add react-native-web
yarn add babel-preset-react-native-web --dev
```

Next we add a custom `.babelrc` file to the root our of project as follows. As described in the documentation, we include Razzle's default babel plugin AND the custom react-native-web plugin.

```json
{
  "presets": ["razzle/babel"],
  "plugins": ["react-native-web"]
}
```

In our code, we modify our `src/client.js` as per the RN Web docs. Notice how we are _not_ calling `ReactDOM.hydrate()` ourselves, as this is done by RN Web.

```js
// ./src/client.js
import React from 'react';
import App from './App';
import { AppRegistry } from 'react-native';

// register the app
AppRegistry.registerComponent('App', () => App);

AppRegistry.runApplication('App', {
  initialProps: {},
  rootTag: document.getElementById('root'),
});

// Allow HMR to work
if (module.hot) {
  module.hot.accept();
}
```

In `src/server.js`, we also can basically copy and paste from the RN Web docs. Important note: RN Web handles CSS-in-js for us, so we remove `assets.client.css` `<link>` tag from our HTML string template and replace it with just the `css` variable we get from RN Web.

```js
// ./src/server.js

import App from './App';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { AppRegistry } from 'react-native';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

server
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {
    // register the app
    AppRegistry.registerComponent('App', () => App);

    // prerender the app
    const { element, getStyleElement } = AppRegistry.getApplication('App', {});
    // first the element
    const html = ReactDOMServer.renderToString(element);
    // then the styles
    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    res.send(
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Welcome to Razzle</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${css}
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${html}</div>
    </body>
</html>`
    );
  });

export default server;
```

### Webpack setup

Like [create-react-app](https://github.com/facebook/create-react-app), Razzle already takes care of aliasing `react-native` to `react-native-web` with webpack for you. So we don't need to mess with that.

However, since we are using RN Web for all our CSS, we can get a significant Webpack #perf boost during development and build tasks if we **remove all the built-in CSS loaders from Razzle**. To do this, we create a file called `razzle.config.js` in our root directory and use the `modify` function. Notice that we are using regex tests to sniff which Webpack module rules we should filter out. This approach is _significantly_ better than just removing a rule at a specific index of the rules array, which could change between Razzle releases.

```js
'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    // Since RN web takes care of CSS, we should remove it for a #perf boost
    config.module.rules = config.module.rules
      .filter(
        rule =>
          !(rule.test && rule.test.exec && rule.test.exec('./something.css'))
      )
      .filter(
        rule =>
          !(
            rule.test &&
            rule.test.exec &&
            rule.test.exec('./something.module.css')
          )
      );

    // We should thus also remove extract text plugin too.
    const extPlugin = require(require.resolve('extract-text-webpack-plugin')); // get it out node_modules
    config.plugins = config.plugins.filter(w => !(w instanceof extPlugin));

    return config;
  },
};
```
