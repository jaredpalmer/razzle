# Customization

## Options

As of Razzle 3.2, you can modify some parts of Razzle with options.

We show the default options here:

```js
//./razzle.config.js
module.exports = {
  options: {
    cssPrefix: 'static/css',
    jsPrefix: 'static/js',
    mediaPrefix: 'static/media',
    browserslist: undefined, // or what your apps package.json says
  },
};
```

More options will be added in the future, some options now in experimental will be moved here.

## Plugins

As of Razzle 2.0, you can add your plugins to modify your setup.

- [TypeScript](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-typescript)
- [Vue](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-vue)
- [Elm](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-elm)
- [MDX](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-mdx)
- [See All](https://www.npmjs.com/search?q=razzle-plugin)

### Using Plugins

You can use Razzle plugins by installing in your project and adding them to your `razzle.config.js`. See the README.md of the specific plugin, but generally speaking, the flow is something like...

```bash
yarn add razzle-plugin-xxxx
```

```js
//./razzle.config.js
module.exports = {
  plugins: ['xxxx'],
};
```

### Writing Plugins

Plugins are simply a collection of functions that modify and return Razzle/webpack/jest configuration.

There are five functions that can be used to hook into Razzle configuration.

- modifyOptions - modifies default Razzle options and options passed to Razzle in the `options` key in `razzle.config.js`.
- modifyPaths - modifies default Razzle paths.
- modifyWebpackOptions - modifies some default options that will be used to configure webpack/ webpack loaders and plugins.
- modifyWebpackConfig - modifies the created webpack config.
- modifyJestConfig - modifies jest config that is used to run tests for yor app.

Here is a complete plugin that uses all five functions, usually you just need `modifyWebpackConfig` and/or `modifyWebpackOptions`.

```js
'use strict';

module.exports = {
  modifyOptions({
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the default options/ options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
    },
  }) {
    // Do some stuff...
    return razzleOptions;
  },
  modifyPaths({
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
    },
    paths, // the default paths that will be used by Razzle.
  }) {
    // Do some stuff...
    return paths;
  },
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the default options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    if (target === 'web') {
      // client only
    }

    if (target === 'node') {
      // server only
    }

    if (dev) {
      // dev only
    } else {
      // prod only
    }

    // Do some stuff...
    return webpackOptions;
  },
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
    if (target === 'web') {
      // client only
    }

    if (target === 'node') {
      // server only
    }

    if (dev) {
      // dev only
    } else {
      // prod only
    }

    // Do some stuff...
    return webpackConfig;
  },
  modifyJestConfig({
    jestConfig, // the created jest config
    webpackObject, // the imported webpack node module
    options: {
      pluginOptions, // the options passed to the plugin ({ name:'pluginname', options: { key: 'value'}})
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // Do some stuff...
    return jestConfig;
  },
};
```

Plugins also support using promises, this example uses `modifyWebpackConfig` but promises are supported in all hooks.

```js
'use strict';

module.exports = {
  modifyWebpackConfig({
    env: { target, dev },
    webpackConfig,
    webpackObject,
    options: { pluginOptions, razzleOptions, webpackOptions },
    paths,
  }) {
    return new Promise(async resolve => {
      if (target === 'web') {
        // client only
      }

      if (target === 'node') {
        // server only
      }

      if (dev) {
        // dev only
        await getDevcert();
      } else {
        // prod only
      }

      // Do some stuff...
      resolve(webpackConfig);
    });
  },
};
```

## Customizing Babel Config

Razzle comes with most of ES6 stuff you need. However, if you want to add your own babel transformations, just add a `.babelrc` file to the root of your project.

```js
{
  "presets": [
    "razzle/babel", // NEEDED
    "stage-0"
   ],
   "plugins": [
     // additional plugins
   ]
}
```

A word of advice: the `.babelrc` file will replace the internal razzle babelrc template. You must include at the very minimum the default razzle/babel preset.

## Extending Webpack

You can also extend the underlying webpack config. Create a file called `razzle.config.js` in your project's root.

All the hook functions supported in plugins is also supported here. We show only one function here for brevity.

```js
// razzle.config.js

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
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    if (target === 'web') {
      // client only
    }

    if (target === 'node') {
      // server only
    }

    if (dev) {
      // dev only
    } else {
      // prod only
    }

    // Do some stuff...
    return webpackConfig;
  },
};
```

A word of advice: `razzle.config.js` is an escape hatch. However, since it's just JavaScript, you can and should publish your `modify` function to npm to make it reusable across your projects. For example, imagine you added some custom webpack loaders and published it as a package to npm as `my-razzle-modifictions`. You could then write your `razzle.config.js` like so:

```js
// razzle.config.js
const modifications = require('my-razzle-modifictions');

module.exports = modifications;
```

Last but not least, if you find yourself needing a more customized setup, Razzle is _very_ forkable. There is one webpack configuration factory that is 300 lines of code, and 4 scripts (`build`, `start`, `test`, and `init`). The paths setup is shamelessly taken from [create-react-app](https://github.com/facebookincubator/create-react-app), and the rest of the code related to logging.

#### New in razzle 3.2

`razzle.config.js` modify also support using promises

```js
// razzle.config.js

module.exports = {
  modifyWebpackConfig({
    env: { target, dev },
    webpackConfig,
    webpackObject,
    options: { razzleOptions, webpackOptions },
    paths,
  }) {
    return new Promise(async resolve => {
      if (target === 'web') {
        // client only
      }

      if (target === 'node') {
        // server only
      }

      if (dev) {
        // dev only
        await getDevcert();
      } else {
        // prod only
      }

      // Do some stuff...
      resolve(webpackConfig);
    });
  },
};
```

## CSS Modules

Razzle supports [CSS Modules](https://github.com/css-modules/css-modules) using Webpack's [css-loader](https://github.com/webpack-contrib/css-loader). Simply import your CSS file with the extension `.module.css` and Razzle will process the file using `css-loader`.

```jsx
import React from 'react';
import styles from './style.module.css';

const Component = () => <div className={styles.className} />;

export default Component;
```

## Polyfills

Polyfills for IE 9, IE 10, and IE 11 are no longer included by default (but you can opt in!)
We have dropped default support for Internet Explorer 9, 10, and 11. If you still need to support these browsers, follow the instructions below.

First, install `react-app-polyfill`:

`npm install react-app-polyfill`
or

`yarn add react-app-polyfill`
Next, place one of the following lines at the very top of `src/client.js:`

```javascript
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
```

## Absolute Imports

You can configure your application to support importing modules using absolute paths. This can be done by configuring a jsconfig.json or tsconfig.json file in the root of your project. If you're using TypeScript in your project, you will already have a tsconfig.json file.

Below is an example jsconfig.json file for a JavaScript project (or tsconfig.json if you're using TypeScript). You can create the file if it doesn't already exist:

```json
{
  "compilerOptions": {
    "baseUrl": "src"
  },
  "include": ["src"]
}
```

To make the Jest test runner work with absolute imports, you'll need to add a `jest` configuration option to your package.json:

```jsonc
{
  "name": "my-razzle-app",
  "version": "1.0.0",
  "license": "MIT",
  /* ...dependencies, etc... */
  "jest": {
    "moduleDirectories": ["node_modules", "src"]
  }
}
```

Now that you've configured your project to support absolute imports, if you want to import a module located at src/components/Button.js, you can import the module like so:
```js
import Button from 'components/Button';
```
