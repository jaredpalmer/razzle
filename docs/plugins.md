---
id: plugins
title: Plugins
---

As of Razzle 2.0, you can add your plugins to modify your setup.

- [TypeScript](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-typescript)
- [Vue](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-vue)
- [Elm](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-elm)
- [MDX](https://github.com/jaredpalmer/razzle/tree/master/packages/razzle-plugin-mdx)
- [See All](https://www.npmjs.com/search?q=razzle-plugin)

# Using Plugins

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

# Writing Plugins

Plugins are simply functions that modify and return Razzle's webpack config.

```js
'use strict';

module.exports = function myRazzlePlugin(config, env, webpack, options) {
  const { target, dev } = env;

  if (target === 'web') {
    // client only
  }

  if (target === 'server') {
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
