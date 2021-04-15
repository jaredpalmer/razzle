'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

module.exports = {
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);

    config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx'];

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoaderFinder = makeLoaderFinder('babel-loader');
    const babelLoader = config.module.rules.find(babelLoaderFinder);

    // Get the correct `include` option, since that hasn't changed.
    // This tells Razzle which directories to transform.
    const { include } = babelLoader;

    // Configure esbuild-loader
    const esbuildLoader = {
      include,
      test: /\.tsx?$/,
      use: [
        {
          loader: require.resolve('esbuild-loader'),
          options: {
            loader: 'tsx',
            target: opts.env.target === 'web' ? 'es6' : 'node12',
            tsconfigRaw: require('./tsconfig.json'),
          },
        },
      ],
    };

    // Remove babel
    config.module.rules = config.module.rules.filter(
      (rule) => !babelLoaderFinder(rule)
    );

    config.module.rules.push(esbuildLoader);

    // Do typechecking in a separate process,
    // We can run it only in client builds.
    if (opts.env.target === 'web') {
      config.plugins.push(
        new ForkTsCheckerWebpackPlugin({
          typescript: {
            build: true,
            configFile: './tsconfig.json',
          },
        })
      );
      if (opts.env.dev) {
        // As suggested by Microsoft's Outlook team, these optimizations
        // crank up Webpack x TypeScript perf.
        // @see https://medium.com/@kenneth_chau/speeding-up-webpack-typescript-incremental-builds-by-7x-3912ba4c1d15
        config.output.pathinfo = false;
        config.optimization = {
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
        };
      }
    }

    return config;
  },
};
