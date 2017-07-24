# Razzle Sass Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-scss
cd with-scss
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This example shows how to support `.scss` files by including `node-sass` and [`fast-sass-loader`](https://www.npmjs.com/package/fast-sass-loader) in `razzle.config.js`. It also applies `autoprefixer`.
