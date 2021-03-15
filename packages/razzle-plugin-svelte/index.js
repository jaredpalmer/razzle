"use strict";

module.exports = {
  modifyWebpackOptions(opts) {
    const options = opts.options.webpackOptions;    // Add .svelte to exlude
    options.fileLoaderExclude = [/\.svelte?$/, ...options.fileLoaderExclude];
    return options;
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;    // Add .svelte to extensions

    config.resolve.extensions = [...config.resolve.extensions, '.svelte'];

    config.module.rules.push({
      test: /\.svelte$/,
      loader: require.resolve('svelte-loader'),
      options: {
        preprocess: require('svelte-preprocess')({})
      }
    });

    return config;
  },
};
