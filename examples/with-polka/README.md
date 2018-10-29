# Razzle Polka Example

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

An example of how to use a custom, express middleware-compatible server like [polka](https://github.com/lukeed/polka) with razzle. It satisfies the entry points
`src/index.js` for the server and and `src/client.js` for the browser. HMR works for server-side changes too by creating new instances of the polka server handler.
