# razzle-plugin-less

This package contains a plugin for using [LESS](http://lesscss.org/) with Razzle

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-less --dev
```

```bash
npm install razzle-plugin-less  --save-dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['less'],
};
```

---

### With custom options

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'less',
      options: {
        less: {
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

### less: _object_

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

See [less options](http://lesscss.org/usage/#less-options) to override configs.

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

See [css loader options](https://github.com/webpack-contrib/css-loader#options) to override configs.

---

#### style: _object_

default

```js
{}
```

Style loader only used in `development` environment.

See [style loader options](https://github.com/webpack-contrib/style-loader#options) to override configs.
