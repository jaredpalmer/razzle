# razzle-plugin-typescript

This package contains a plugin for using TypeScript with Razzle

## Usage in Razzle Projects

```
yarn add razzle-plugin-typescript
```

Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['typescript'],
};
```

### With custom options:

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'typescript',
      options: {
        useBabel: false,
        tsLoader: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: './tslint.json',
          watch: './src',
          typeCheck: true,
        },
      },
    },
  ],
};
```

## Options

**useBabel: _boolean_** (defaults: false)

Set `useBabel` to `true` if you want to keep using `babel` for _JS_/_TS_ interoperability, or if you want to apply any babel transforms to typescript files. (i.e.: [`babel-plugin-styled-components`](https://github.com/styled-components/babel-plugin-styled-components)).

**tsLoader: _TSLoaderOptions_** (defaults: { transpileOnly: true, experimentalWatchApi: true })

Use this to override [`ts-loader`](https://github.com/TypeStrong/ts-loader) options. Check all the options here: [ts-loader options](https://github.com/TypeStrong/ts-loader#loader-options).

**forkTsChecker: _TSCheckerOptions_** (defaults: { tsconfig: './tsconfig.json', tslint: './tslint.json', watch: './src', typeCheck: true })

Use this to override [`fork-ts-checker-webpack-plugin`](https://github.com/Realytics/fork-ts-checker-webpack-plugin) options. Check all the options here: [fork-ts-checker-webpack-plugin options](https://github.com/Realytics/fork-ts-checker-webpack-plugin#options).
