# Razzle Vue Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the canary release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@canary --example with-vue with-vue

cd with-vue
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This shows how to setup [Vue](https://vuejs.org/) with Razzle.

Here is a list of changes from Razzle's base template:
  1. Install `razzle-plugin-vue`, `eslint-plugin-vue` as devDependencies.
  2. Add `vue` to the razzle plugins config
  3. Install `vue`, `vue-server-renderer` as dependencies
  4. Remove `react`, `react-dom`, `react-router-dom` entirely
  5. Update `server/server.js` to use `vue-server-renderer`'s `renderToString` function.
  6. Update `client.js` to mount Vue to `#app` and start HMR
