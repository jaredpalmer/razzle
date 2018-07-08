'use strict';

const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const Helpers = new WebpackConfigHelpers(process.cwd());

module.exports = function modify(config, { dev }) {
  // Add .elm extension
  config.resolve.extensions.push('.elm');

  // Don't parse as JS
  config.module.noParse = config.module.noParse
    ? config.module.noParse.push(/.elm$/)
    : [/.elm$/];

  // Exclude from file-loader
  config.module.rules[
    config.module.rules.findIndex(Helpers.makeLoaderFinder('file-loader'))
  ].exclude.push(/\.(elm)$/);

  if (dev) {
    config.module.rules.push({
      test: /\.elm$/,
      exclude: [/elm-stuff/, /node_modules/],
      use: [
        {
          loader: require.resolve('elm-webpack-loader'),
          options: {
            verbose: true,
            warn: true,
            pathToMake: require('elm/platform').executablePaths['elm-make'],
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
            pathToMake: require('elm/platform').executablePaths['elm-make'],
          },
        },
      ],
    });
  }

  return config;
};
