# Razzle Hyperapp Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-hyperapp
cd with-hyperapp
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This shows how to setup [Hyperapp](https://github.com/hyperapp/hyperapp/) with Razzle.

Here is a list of changes from Razzle's base template:

1.  Install `babel-plugin-transform-react-jsx` as a devDependency.
2.  Extend Razzle's babel config with a custom `.babelrc`
3.  Install `hyperapp` and `"@hyperapp/render`
4.  Remove `react`, `react-dom`, `react-router-dom` entirely
5.  Update `server.js` to use `@hyperapp/render`'s `withRender` function. Also remove the `<div id="root">` element from our html template since Hyperapp can render to the body.
6.  Add a `main.js` file which exports the essential pieces of Hyperapp, which are the `state`, `actions`, and `view`. These are to be shared between the `server.js` and `client.js` files.
