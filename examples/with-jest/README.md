# Using Razzle and Jest

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-jest
cd with-jest
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This is an example of how to use [Jest](https://github.com/facebook/jest) with a Razzle project. To use Jest we need to expose Razzle's builtin babel preset in a `.babelrc` file. We also add a small Jest configuration to our `package.json`.