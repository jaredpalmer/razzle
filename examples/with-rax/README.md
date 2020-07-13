# Razzle Rax Example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("with-rax", "with-rax", symlink=false, yarnlink=true, install=true, test=false);'

cd with-rax
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This example shows how to use [Rax](https://github.com/alibaba/rax) instead of React
in a Razzle a project.
