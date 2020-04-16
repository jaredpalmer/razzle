# Razzle Single Page App Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/basic-spa
cd basic-spa
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This is a basic, bare-bones example of how to use razzle to build a single page application (instead of a universal/isomorphic application). It satisfies the entry point `src/client.js` for the browser and includes a template HTML file in `public/index.html`.
