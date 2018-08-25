# razzle-plugin-mdx

This package contains a plugin for using mdx with Razzle

## Usage in Razzle Projects

```
npm i razzle-plugin-mdx
```

or

```
yarn add razzle-plugin-mdx
```

### Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: ["mdx"]
};
```

### With custom options:

```js
// razzle.config.js
const images = require("remark-images");
const emoji = require("remark-emoji");

module.exports = {
  plugins: [
    {
      name: "mdx",
      options: {
        mdPlugins: [images, emoji]
      }
    }
  ]
};
```

## Options

Check all the options here: [mdx-js options](https://github.com/mdx-js/mdx#options).
