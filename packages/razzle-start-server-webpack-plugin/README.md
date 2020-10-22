# start-server-webpack-plugin

> Automatically start your server once Webpack's build completes + handle hot reloading (HMR)

[![travis build](https://img.shields.io/travis/ericclemmons/start-server-webpack-plugin.svg)](https://travis-ci.org/ericclemmons/start-server-webpack-plugin)
[![version](https://img.shields.io/npm/v/start-server-webpack-plugin.svg)](http://npm.im/start-server-webpack-plugin)
[![downloads](https://img.shields.io/npm/dm/start-server-webpack-plugin.svg)](http://npm-stat.com/charts.html?package=start-server-webpack-plugin)
[![MIT License](https://img.shields.io/npm/l/start-server-webpack-plugin.svg)](http://opensource.org/licenses/MIT)

### Installation

```shell
$ npm install --save-dev start-server-webpack-plugin
```

### Usage

In `webpack.config.server.babel.js`:

```js
import StartServerPlugin from "start-server-webpack-plugin";

export default {
  ...
  plugins: [
    ...
    // Only use this in DEVELOPMENT
    new StartServerPlugin({
      // print server logs
      verbose: true,
      // print plugin/server errors
      debug: false,
      // name of the entry to run, defaults to 'main'
      entryName: 'server',
      // any arguments to nodejs when running the entry, this one allows debugging
      nodeArgs: ['--inspect-brk'],
      // any arguments to pass to the script
      scriptArgs: ['scriptArgument1', 'scriptArgument2'],
      // Allow typing 'rs' to restart the server. default: only if NODE_ENV is 'development'
      restartable: true | false,
      // Only run the server once (default: false)
      once: false | true,
    }),
    ...
  ],
  ...
}
```

The `entryName` argument defaults to `"main"`, which is the name Webpack uses if you use the string or array versions of the `entry` option.

You can use `nodeArgs` and `args` to pass arguments to node and your script, respectively. For example, you can use this to use the node debugger.

To use Hot Module Reloading with your server code, set Webpack to "hot" and "watch" modes.
This plugin appends some code to the end of the entry so that it can handle HMR and restarts; no need to add any of the `webpack/hot` modules.

### Upgrading from v2

- Remove the `name` option and define `entryName` if it's not just `"main"`
- Remove any hot reloading additions

### License

> MIT License 2016-2018 © Eric Clemmons
