# razzle-plugin-manifest

This package contains a plugin for generating manifest file for splitted chunk paths with Razzle

## Usage in Razzle Projects

```
npm i razzle-plugin-manifest
```

or

```
yarn add razzle-plugin-manifest
```

### Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['manifest'],
};
```

A file called `chunks.json` will get generated at build time. you can import the file using `RAZZLE_CHUNKS_MANIFEST` enviroment variable.

example:

```js
const chunks = require(process.env.RAZZLE_CHUNKS_MANIFEST);
```
