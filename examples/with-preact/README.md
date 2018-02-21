# Razzle Preact Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-preact
cd with-preact
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This shows how to setup [Preact](https://github.com/developit/preact) with Razzle.

Here is a list of changes from Razzle's base template:

1. Install `babel-plugin-transform-react-jsx` as a devDependency.
2. Extend Razzle's babel config with a custom `.babelrc`
3. Install `preact` and `preact-render-to-string`
4. Remove `react`, `react-dom`, `react-router-dom` entirely
5. Update `server.js` to use `preact-render-to-string`'s `render` function. Also remove the `<div id="root">` element from our html template since Preact can render to the body.
