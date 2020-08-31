# Razzle Preact Example

## How to use

<!-- START install generated instructions please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->
This is the development documentation for this example

Clone the `razzle` repository:

```bash
git clone https://github.com/jaredpalmer/razzle.git

cd razzle
yarn install --frozen-lockfile --ignore-engines --network-timeout 30000
```

Create and start the example:

```bash
node -e 'require("./test/fixtures/util").setupStageWithExample("with-preact", "with-preact", symlink=false, yarnlink=true, install=true, test=false);'

cd with-preact
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This shows how to setup [Preact](https://github.com/developit/preact) with Razzle.

Here is a list of changes from Razzle's base template:

  1. Install `babel-plugin-transform-react-jsx` as a devDependency.
  2. Extend Razzle's babel config with a custom `.babelrc`
  3. Install `preact` and `preact-render-to-string`
  4. Remove `react`, `react-dom`, `react-router-dom` entirely
  5. Update `server.js` to use `preact-render-to-string`'s `render` function. Also remove the `<div id="root">` element from our html template since Preact can render to the body.
