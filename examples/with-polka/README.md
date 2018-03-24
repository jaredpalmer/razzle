# Razzle Polka (webserver) Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-polka
cd with-polka
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This is the same as the [basic example](https://github.com/jaredpalmer/razzle/tree/next/examples/basic), but uses [Polka](https://github.com/lukeed/polka) as the webserver, instead of Express.
