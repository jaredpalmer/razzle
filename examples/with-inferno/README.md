# Razzle Inferno Example

## How to use

Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-inferno
cd with-inferno
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example

This shows how to use [Inferno](https://github.com/infernojs) instead of React in a Razzle project.

Here is a list of changes from Razzle's base template:

1. Install `babel-plugin-inferno` as a devDependency.
2. Extend Razzle's babel config with a custom `.babelrc`
3. Install `inferno`, `inferno-server`, `inferno-devtools`, `inferno-component` as dependencies
4. Remove `react`, `react-dom`, `react-router-dom` entirely
5. Update `server/server.js` to use `inferno-server`'s `renderToString` function.
6. Update `client.js` to configure Inferno for HMR.
