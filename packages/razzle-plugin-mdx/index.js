'use strict';

const { babelLoaderFinder } = require('./helpers');
const path = require('path');

const defaultOptions = {};

module.exports = {
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);

    const options = Object.assign(
      {},
      defaultOptions,
      opts.options.pluginOptions
    );

    config.resolve.modules = [
      ...config.resolve.modules,
      path.join(__dirname, './node_modules'),
    ];
    config.resolve.extensions = [...config.resolve.extensions, '.md', '.mdx'];

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = config.module.rules.find(babelLoaderFinder);
    if (!babelLoader) {
      throw new Error(`'babel-loader' required for nice 'MDX loader' work`);
    }

    // Get the correct `include` option, since that hasn't changed.
    // This tells Razzle which directories to transform.
    const { include } = babelLoader;

    // Configure @mdx-js/loader
    const mdxLoader = {
      include,
      test: /\.mdx?$/,
      use: [
        ...babelLoader.use,
        {
          loader: require.resolve('@mdx-js/loader'),
          options: Object.assign({}, options),
        },
      ],
    };

    config.module.rules.push(mdxLoader);

    return config;
  },
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev // is this a development build? true or false
    },
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
      pluginOptions
    },
    paths // the modified paths that will be used by Razzle.
  }) {
    // Don't import md and mdx files with file-loader
    webpackOptions.fileLoaderExclude.push(/\.mdx?$/);
    return webpackOptions;
  },
};
