# razzle-plugin-graphql

This package contains a plugin for using [graphql/gql](https://www.npmjs.com/package/graphql-tag) with Razzle

## Usage in Razzle Projects

```bash
yarn add razzle-plugin-graphql --dev
```

### With the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['graphql'],
};
```

---

### With custom options

No supported options right now

## Options

No supported options right now

---

## Use

To use a `.graphql` or `.gql` simply import them in your component.

```
import query from './query.graphql';

console.log(query);
// {
//   "kind": "Document",
// ...
```

see the `graphql-tag` package documentation for further information.