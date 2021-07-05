# Razzle With Jsconfig Paths Example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("with-jsconfig-paths", "with-jsconfig-paths", symlink=false, yarnlink=true, install=true, test=false);'

cd with-jsconfig-paths
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This is a basic, bare-bones example of how to use razzle with jsconfig paths, this also works with tsconfig.
It satisfies the entry points `src/index.js` for the server and and `src/client.js` for the browser.
