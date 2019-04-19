# Razzle Vue Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-vue
cd with-vue
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This shows how to setup [Vue](https://vuejs.org/) with Razzle.

Here is a list of changes from Razzle's base template:
  1. Install `razzle-plugin-vue`, `eslint-plugin-vue` as devDependencies.
  2. Add `vue` to the razzle plugins config
  3. Install `vue`, `vue-server-renderer` as dependencies
  4. Remove `react`, `react-dom`, `react-router-dom` entirely
  5. Update `server/server.js` to use `vue-server-renderer`'s `renderToString` function.
  6. Update `client.js` to mount Vue to `#app` and start HMR
