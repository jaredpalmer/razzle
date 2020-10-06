# Experimental Features

Razzle has support for some experimental features. Currently razzle has experimental support for:

- [React refresh](#enable-react-refresh) - [react-refresh](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [Static export](#enable-static-export)
- [New babel loader](#enable-the-new-babel-loader)
- [New externals resolution](#enable-the-new-externals-resolution)
- [New splitChunks configuration](#enable-the-new-split-chunks-configuration)
- [New contentHash configuration](#enable-the-new-content-hash-configuration)
- [New mainFields configuration](#enable-the-new-main-fields-configuration)

More features may be added in the future and may become fully supported features.

## Razzle 4.0

If you want to be ready for the Razzle 4.0 release you can enable some experimental features to be sure you build will work on 4.0.

```js
// razzle.config.js

module.exports = {
  experimental: {
    newBabel: true,
    newExternals: true,
    newSplitChunks: true,
    newContentHash: true,
    newMainFields: true,
  },
};
```

### Enable react refresh:

```js
// razzle.config.js

module.exports = {
  experimental: {
    reactRefresh: true,
  },
};
```

### Enable the new babel loader:

```js
// razzle.config.js

module.exports = {
  experimental: {
    newBabel: true,
  },
};
```

### Enable the new externals resolution:

```js
// razzle.config.js

module.exports = {
  experimental: {
    newExternals: true,
  },
};
```

### Enable the new splitChunks configuration:

```js
// razzle.config.js

module.exports = {
  experimental: {
    newSplitChunks: true,
  },
};
```

### Enable the new contentHash configuration:

```js
// razzle.config.js

module.exports = {
  experimental: {
    newContentHash: true,
  },
};
```

### Enable the new mainFields configuration:

```js
// razzle.config.js

module.exports = {
  experimental: {
    newMainFields: true,
  },
};
```
