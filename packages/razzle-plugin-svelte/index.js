"use strict";

const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const Helpers = new WebpackConfigHelpers(process.cwd());


module.exports = {
  modifyWebpackOptions(opts) {
    const options = Object.assign({}, opts.options.webpackOptions);    // Add .svelte to exlude
    options.fileLoaderExlude = [/\.svelte?$/, ...options.fileLoaderExlude];
    return options;
  },
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);    // Add .svelte to extensions

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
