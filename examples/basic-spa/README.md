# Razzle Single Page App Example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("basic-spa", "basic-spa", symlink=false, yarnlink=true, install=true, test=false);'

cd basic-spa
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example

This is a basic, bare-bones example of how to use razzle to build a single page application (instead of a universal/isomorphic application). It satisfies the entry point `src/client.js` for the browser and includes a template HTML file in `public/index.html`.
