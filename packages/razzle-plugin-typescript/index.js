'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { babelLoaderFinder, eslintLoaderFinder } = require('./helpers');

const defaultOptions = {
  useBabel: false,
  tsLoader: {
    transpileOnly: true,
    experimentalWatchApi: true,
  },
  forkTsChecker: {
    tsconfig: './tsconfig.json',
    tslint: './tslint.json',
    watch: ['./src'],
    typeCheck: true,
  },
};

function modify(baseConfig, { target }, webpack, userOptions = {}) {
  const options = Object.assign({}, defaultOptions, userOptions);
  const config = Object.assign({}, baseConfig);

  config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx'];

  if (!options.useBabel) {
    // Locate eslint-loader and remove it (we're using only tslint)
    config.module.rules = config.module.rules.filter(
      rule => !eslintLoaderFinder(rule)
    );
  }

  // Safely locate Babel-Loader in Razzle's webpack internals
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(
      `'babel-loader' was erased from config, we need it to define 'include' option for 'ts-loader'`
    );
  }

  // Get the correct `include` option, since that hasn't changed.
  // This tells Razzle which directories to transform.
  const { include } = babelLoader;

  // Configure ts-loader
  const tsLoader = {
    include,
    test: /\.tsx?$/,
    use: [
      {
        loader: require.resolve('ts-loader'),
        options: Object.assign({}, defaultOptions.tsLoader, options.tsLoader),
      },
    ],
  };

  if (options.useBabel) {
    // If using babel, also add babel-loader to ts files,
    // so we can use babel plugins on tsx files too
    tsLoader.use = [babelLoader.use[1], ...tsLoader.use];
  } else {
    // If not using babel, remove it
    config.module.rules = config.module.rules.filter(
      rule => !babelLoaderFinder(rule)
    );
  }

  config.module.rules.push(tsLoader);

  // Do typechecking in a separate process,
  // We can run it only in client builds.
  if (target === 'web') {
    config.plugins.push(
      new ForkTsCheckerWebpackPlugin(
        Object.assign({}, defaultOptions.forkTsChecker, options.forkTsChecker)
      )
    );
  }

  return config;
}

module.exports = modify;
