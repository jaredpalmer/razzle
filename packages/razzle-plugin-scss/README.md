# razzle-plugin-scss

This package contains a plugin for using [SCSS/SASS](https://sass-lang.com/) with Razzle

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-scss --dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['scss'],
};
```

---

### With custom options

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'scss',
      options: {
        postcss: {
          dev: {
            sourceMap: false,
          },
        },
      },
    }
  ],
};
```

## Options

Please remember that custom options will extends default options using `Object.assign`.
Array such as postcss.plugins __WILL NOT BE EXTENDED OR CONCATED__, it will override all default plugins.

---

### postcss: _object_

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

---

### sass: _object_

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

See [node-sass options](https://github.com/sass/node-sass#options) to override configs.

---

### css: _object_

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

---

#### style: _object_

default

```js
{}
```

Style loader only used in `development` environment.

See [style loader options](https://github.com/webpack-contrib/style-loader#options) to override configs.

#### resolveUrl: _object_

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