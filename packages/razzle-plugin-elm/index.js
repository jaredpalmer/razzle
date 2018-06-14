'use strict';

const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');

const Helpers = new WebpackConfigHelpers(process.cwd());

module.exports = function modify(config, { dev }) {
  config.module.noParse.push([/.elm$/]);

  config.module.rules[
    config.module.rules.findIndex(Helpers.makeLoaderFinder('file-loader'))
  ].exclude.push(/\.(elm)$/);

  config.resolve.extensions = config.resolve.extensions.push('.elm');

  if (dev) {
    config.module.rules.push({
      test: /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      use: [
        {
          loader: 'elm-hot-loader',
        },
        {
          loader: 'elm-webpack-loader',
          options: {
            verbose: true,
            warn: true,
            pathToMake: require.resolve('elm/platform').executablePaths[
              'elm-make'
            ],
            forceWatch: true,
          },
        },
      ],
    });
  } else {
    // Production
    config.module.rules.push({
      test: /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      use: [
        {
          loader: require.resolve('elm-webpack-loader'),
          options: {
            pathToMake: require.resolve('elm/platform').executablePaths[
              'elm-make'
            ],
          },
        },
      ],
    });
  }

  return config;
};
