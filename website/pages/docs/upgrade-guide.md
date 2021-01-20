# Upgrade guide from 3.x to 4.x

## Dependencies

Update/add razzle core dependencies

```bash
yarn add razzle razzle-dev-utils babel-preset-razzle --dev
```

Update/add razzle peerdependencies

```bash
yarn add webpack-dev-server@3.11.0 mini-css-extract-plugin@0.9.0 --dev
```

Choose your webpack version

```bash
yarn add webpack@5.16.0 --dev
# or
yarn add webpack@4.46.0 --dev
```

Update/add razzle plugins if you use any

```bash
yarn add razzle-plugin-scss --dev
```

## Spa apps

Remove `--type=spa` from scripts

```json
{
  "scripts": {
    "start": "razzle start --type=spa",
    "build": "razzle build --type=spa"
  }
}
```

Add Options

```js
//./razzle.config.js
module.exports = {
  options: {
    buildType: 'spa'
  },
};
```

## Plugins

Plugins are now multiple functions as opposed to one before.

E.g. change:

```js
'use strict';

module.exports = function myRazzlePlugin(config, { target, dev }, webpack, options) {
  // Do some stuff to config
  return config;
};
```

To:

```js
'use strict';

module.exports = {
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // Do some stuff to webpackConfig
    return webpackConfig;
  }
};
```

You can also make use of `modifyOptions`, `modifyPaths`, `modifyWebpackOptions` and `modifyJestConfig`.

To make plugins simpler and more composable.

## Extending Webpack

Modify is now multiple functions as opposed to one before.

E.g. change:

```js
'use strict';
// razzle.config.js

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something to config
    return config;
  },
};
```

To:

```js
'use strict';

module.exports = {
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // Do some stuff to webpackConfig
    return webpackConfig;
  }
};
```

You can also make use of `modifyOptions`, `modifyPaths`, `modifyWebpackOptions` and `modifyJestConfig`.

To make extending webpack simpler.
