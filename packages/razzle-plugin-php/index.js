'use strict';

const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

module.exports = function modify(config) {
  config.resolve.extensions.push('.php');

  // Exclude from file-loader
  config.module.rules[
    config.module.rules.findIndex(makeLoaderFinder('file-loader'))
  ].exclude.push(/\.(php)$/);

  // Don't parse as JS
  config.module.noParse = config.module.noParse
    ? config.module.noParse.concat([/.php$/])
    : [/.php$/];

  // Add a custom babel loader (in addition to the one for .js)
  // making sure to ignore .babelrc
  config.module.rules.push({
    test: /\.php$/,
    include: config.module.rules.find(makeLoaderFinder('babel-loader')).include,
    use: [
      {
        loader: 'babel-loader',
        options: {
          presets: [require.resolve('babel-preset-php')],
          babelrc: false,
        },
      },
    ],
  });

  return config;
};
