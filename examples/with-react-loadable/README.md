# Razzle React Loadable Example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("with-react-loadable", "with-react-loadable", symlink=false, yarnlink=true, install=true, test=false);'

cd with-react-loadable
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This sample has the full SSR setup as described in the [react-loadable docs](https://github.com/thejameskyle/react-loadable#--------------server-side-rendering).
It demonstrates simple dynamic imports using [react-loadable](https://github.com/thejameskyle/react-loadable) on top of SSR with razzle.
