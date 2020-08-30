'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    config.module.rules[2].exclude.push(/\.(elm)$/);

    config.module.noParse = [/.elm$/];
    config.resolve.extensions.push('.elm');

    if (opts.env.dev) {
      config.module.rules.push({
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          {
            loader: 'elm-webpack-loader',
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
            loader: 'elm-webpack-loader',
            options: {
              pathToMake: require('elm/platform').executablePaths['elm-make'],
            },
          },
        ],
      });
    }

    return config;
  },
};
