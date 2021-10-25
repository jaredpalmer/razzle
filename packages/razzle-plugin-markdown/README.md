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

Files with .md extension will be loaded as markdown and transpiled to html markup.

example:

```jsx
import content from './myfile.md';


const Example = () => (
  <div dangerouslySetInnerHTML={{ __html: content }}/>
);

```

