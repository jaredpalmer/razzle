# Razzle TypeScript Example

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
node -e 'require("./test/fixtures/util").setupStageWithExample("with-typescript", "with-typescript", symlink=false, yarnlink=true, install=true, test=false);'

cd with-typescript
yarn start
```
<!-- END install generated instructions please keep comment here to allow auto update -->

## Idea behind the example
This is an of how to use Razzle with [TypeScript](https://github.com/Microsoft/TypeScript).

Basic razzle will uses Babel to transform TypeScript to plain JavaScript ( with babel-loader ), and uses TypeScript for type-checking.
Razzle knows how to resolve `.ts` and `.tsx` files out of box,
