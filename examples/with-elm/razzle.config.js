'use strict';

module.exports = {
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    webpackOptions.fileLoaderExclude.push(/\.(elm)$/);
    return webpackOptions;
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;


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
