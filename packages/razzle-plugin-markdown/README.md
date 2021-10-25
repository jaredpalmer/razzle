# razzle-plugin-markdown

This package contains a plugin for using [Markdown](https://en.wikipedia.org/wiki/Markdown) with Razzle

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-markdown --dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['markdown'],
};
```

Files with an ending in the name .md will load as markdown

example:

```jsx
import myfile from './myfile.md';
```

