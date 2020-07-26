# Customization

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

Plugins are simply functions that modify and return Razzle's webpack config.

```js
'use strict';

module.exports = function myRazzlePlugin(config, env, webpack, options) {
  const { target, dev } = env;

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
};
```

##### New in razzle 3.2

Plugins also support using promises

```js
'use strict';

module.exports = function myRazzlePlugin(webpackConfig, env, webpack, options) {
  const { target, dev } = env;

  return new Promise(async (resolve) => {
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
  })
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

```js
// razzle.config.js

module.exports = {
  modify: (config, { target, dev }, webpack) => {
    // do something to config

    return config;
  },
};
```

A word of advice: `razzle.config.js` is an escape hatch. However, since it's just JavaScript, you can and should publish your `modify` function to npm to make it reusable across your projects. For example, imagine you added some custom webpack loaders and published it as a package to npm as `my-razzle-modifictions`. You could then write your `razzle.config.js` like so:

```
// razzle.config.js
const modify = require('my-razzle-modifictions');

module.exports = {
  modify
}
```

Last but not least, if you find yourself needing a more customized setup, Razzle is _very_ forkable. There is one webpack configuration factory that is 300 lines of code, and 4 scripts (`build`, `start`, `test`, and `init`). The paths setup is shamelessly taken from [create-react-app](https://github.com/facebookincubator/create-react-app), and the rest of the code related to logging.

#### New in razzle 3.2

`razzle.config.js` modify also support using promises

```js
// razzle.config.js

module.exports = {
  modify: (webpackConfig, { target, dev }, webpack) => {

    return new Promise(async (resolve) => {
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
    })
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

## Experimental

Razzle has support for some experimental features. Currently razzle has experimental support for [react-refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin) and static export. More features may be added in the future and may become fully supported features.

To enable react-refresh:

```js
// razzle.config.js

module.exports = {
  experimental: {
    reactRefresh: true,
  },
};
```

To enable static export:

Add `export` to your `package.json`'s scripts like so:

```diff
"scripts": {
+  "export": "razzle static export",
}
```

Add a `static_export.js` to your src dir:

```js
import { renderApp } from './server';

export const render = (req, res) => {
  const { html } = renderApp(req, res);

  res.json({ html });
};

export const routes = () => {
  return ['/', '/about'];
};
```

Run `npm export` or `yarn export`:

Renders a static version of specified routes to the build folder based on the built production app.
Your prerendered app is ready to be served!

To enable static export with options:

```js
// razzle.config.js

module.exports = {
  experimental: {
    static_export: {
      routes_export: 'routes',
      render_export: 'render'
    },
  },
};
```
