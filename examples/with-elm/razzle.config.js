'use strict';

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here

    appConfig.module.rules[2].exclude.push(/\.(elm)$/);

    appConfig.module.noParse = [/.elm$/];
    appConfig.resolve.extensions = config.resolve.extensions.concat(['.elm']);

    if (dev) {
      appConfig.module.rules.push({
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
              pathToMake: require('elm/platform').executablePaths['elm-make'],
              forceWatch: true,
            },
          },
        ],
      });
    } else {
      // Production
      appConfig.module.rules.push({
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

    return appConfig;
  },
};
