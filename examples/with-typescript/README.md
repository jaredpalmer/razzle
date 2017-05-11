# Razzle TypeScript Example

## How to use
Download the example [or clone the whole project](https://github.com/jaredpalmer/razzle.git):

```bash
curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz --strip=2 razzle-master/examples/with-typescript
cd with-typescript
```

Install it and run:

```bash
yarn install
yarn start
```

## Idea behind the example
This is an of how to use Razzle with [TypeScript](https://github.com/Microsoft/TypeScript). 
In `razzle.config.js`, we  locate the part of the webpack configuration 
that is running `babel-loader` and swap it out for `awesome-typescript-loader`. 
Additionally, we make sure Razzle knows how to resolve `.ts` and `.tsx` files. 

The `tslint.json` and `tsconfig.json` are taken from Microsoft's official 
[TypeScript-React-Starter](https://github.com/Microsoft/TypeScript-React-Starter).

Note: You do not techincally _need_ to fully replace `babel-loader` with 
`awesome-typescript-loader` to use TypeScript. Both TS and Babel transpile ES6 code,
so when you run both webpack loaders you are making Razzle do twice the work. From our testing,
this can make HMR extremely slow on larger apps. Thus, this example overwrites
`babel-loader` with `awesome-typescript-loader`.
