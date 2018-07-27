'use strict';

const { babelLoaderFinder, fileLoaderFinder } = require('./helpers');

const defaultOptions = {};

function modify(baseConfig, { target, dev }, webpack, userOptions = {}) {
  const options = Object.assign({}, defaultOptions, userOptions);
  const config = Object.assign({}, baseConfig);

  config.resolve.extensions = [...config.resolve.extensions, '.md', '.mdx'];

  // Safely locate Babel-Loader in Razzle's webpack internals
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(`'babel-loader' required for nice 'MDX loader' work`);
  }

  // Don't import md and mdx files with file-loader
  const fileLoader = config.module.rules.find(fileLoaderFinder);
  fileLoader.exclude = [/\.mdx?$/, ...fileLoader.exclude];

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
        options: Object.assign({}, options.mdxLoader),
      },
    ],
  };

  config.module.rules.push(mdxLoader);

  return config;
}

module.exports = modify;
