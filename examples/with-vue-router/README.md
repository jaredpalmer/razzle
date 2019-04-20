# Razzle Vue Router Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-vue-router
cd with-vue-router
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This shows how to setup [Vue Router](https://router.vuejs.org/) with Vue and Razzle.

Here is a list of changes from Razzle's base template:
  1. Install `connect-history-api-fallback`, `eslint-plugin-vue`, `razzle-plugin-vue`, `vue-template-compiler` as devDependencies
      * `connect-history-api-fallback` is required for `vue-router`'s history mode.
      * `vue-template-compiler` is required by `vue-router`
  2. Add `vue` to the razzle plugins config
  3. Add custom `.eslintrc` to follow `vue` recommended, and `babel-eslint`
  4. Install `vue`, `vue-router`, `vue-server-renderer` as dependencies
  4. Remove `react`, `react-dom`, `react-router-dom` entirely
  5. Update `server/server.js` to use `vue-server-renderer`'s `renderToString` function, enable history mode, add server-side routing
  6. Update `client.js` to wait till `vue-router` is ready, mount Vue to `#app` and start HMR
  7. `App.vue` contains only a `<router-view>` component, which then renders every other page inside it
  8. `Home.vue`, `About.vue` and `PageNotFound.vue` are added
  9. `router.js` exports a `VueRouter` as well as setting up the page routes
