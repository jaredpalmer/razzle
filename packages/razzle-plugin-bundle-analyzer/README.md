# razzle-plugin-bundle-analyzer

This package contains a plugin for using webpack-bundle-analyzer with Razzle

## Usage in Razzle Projects

```
yarn add razzle-plugin-bundle-analyzer
```

Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['bundle-analyzer'],
};
```

### With custom options:

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'bundle-analyzer',
      options: {
        target: 'web', // or 'node'
        env: 'production', // or 'development'
        bundleAnalyzerConfig: {},
      },
    },
  ],
};
```

## Options

**target: _string_** (defaults: 'web')

**env:  _string_** (defaults: 'production')

**bundleAnalyzerConfig: _bundleAnalyzerOptions_** (defaults: {})

Use this to override [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer) options. Check all the options here: [webpack-bundle-analyzer options](https://github.com/webpack-contrib/webpack-bundle-analyzer#options-for-plugin).
