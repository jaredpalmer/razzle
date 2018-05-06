# razzle-dev-utils

This package contains a plugin for using TypeScript with Razzle

## Usage in Razzle Projects

```
npm install --save razzle-plugin-typescript
```

Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: [
    'typescript'
  ],
};
```

Passing custom options to the plugin:

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'typescript',

      // These are the default options.
      options: {
        // Whether you want to keep using babel or not (for JS/TS interoperability)
        // You can set useBabel to false if you have only TS files, or do not want to use
        // any babel transforms
        useBabel: true,

        // Any option you want to pass to ts-loader: https://github.com/TypeStrong/ts-loader
        tsLoader: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },

        // Any option you want to pass to fork-ts-checker-webpack-plugin: https://github.com/Realytics/fork-ts-checker-webpack-plugin
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: './tslint.json',
          watch: './src',
          typeCheck: true,
        }
      },
    },
  ],
};
```