# Razzle Inferno Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the finch release documentation for this example

Create and start the example:

```bash
npx create-razzle-app@finch --example with-inferno with-inferno

cd with-inferno
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This shows how to use [Inferno](https://github.com/infernojs) instead of React in a Razzle project.

Here is a list of changes from Razzle's base template:
  1. Install `babel-plugin-inferno` as a devDependency.
  2. Extend Razzle's babel config with a custom `.babelrc`
  3. Install `inferno`, `inferno-server`, `inferno-devtools`, `inferno-component` as dependencies
  4. Remove `react`, `react-dom`, `react-router-dom` entirely
  5. Update `server/server.js` to use `inferno-server`'s `renderToString` function.
  6. Update `client.js` to configure Inferno for HMR.
