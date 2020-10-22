# razzle-plugin-less

This package contains a plugin for using [LESS](http://lesscss.org/) with Razzle

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-less --dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['less'],
};
```

### With custom options

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'less',
      options: {
        postcss: {
          dev: {
            sourceMap: false,
          },
        },
      },
    },
  ],
};
```

## Options

Please remember that custom options will extends default options using `Object.assign`.
Array such as postcss.plugins **WILL NOT BE EXTENDED OR CONCATED**, it will override all default plugins.

---

### postcss

default

```js
{
  dev: {
    sourceMap: true,
    ident: 'postcss',
  },
  prod: {
    sourceMap: false,
    ident: 'postcss',
  },
  plugins: [
    PostCssFlexBugFixes,
    autoprefixer({
      browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
      flexbox: 'no-2009',
    }),
  ],
}
```

Set `dev` to add config to postcss in `development`.
Set `prod` to add config to postcss in `production`.

See [postcss loader options](https://github.com/postcss/postcss-loader#options) to override configs.


### less

default

```js
{
  dev: {
    sourceMap: true,
    includePaths: [paths.appNodeModules],
  },
  prod: {
    sourceMap: false,
    includePaths: [paths.appNodeModules],
  },
}
```

Set `dev` to add config to postcss in `development`.
Set `prod` to add config to postcss in `production`.

See [less loader options](https://github.com/webpack-contrib/less-loader) to override configs.

---

### css

default

```js
{
  dev: {
    sourceMap: true,
    importLoaders: 1,
    modules: false,
  },
  prod: {
    sourceMap: false,
    importLoaders: 1,
    modules: false,
    minimize: true,
  },
}
```

Set `dev` to add config to postcss in `development`.
Set `prod` to add config to postcss in `production`.

See [css loader options](https://github.com/webpack-contrib/css-loader#options) to override configs.


#### style

default

```js
{
}
```

Style loader only used in `development` environment.

See [style loader options](https://github.com/webpack-contrib/style-loader#options) to override configs.

#### resolveUrl

default

```js
{
  dev: {},
  prod: {},
}
```

Set `dev` to add config to postcss in `development`.
Set `prod` to add config to postcss in `production`.

See [resolve url loader options](https://github.com/bholloway/resolve-url-loader#options) to override configs.
