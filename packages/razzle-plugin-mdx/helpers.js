'use strict';
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const babelLoaderFinder = makeLoaderFinder('babel-loader');
const fileLoaderFinder = makeLoaderFinder('file-loader');
const mdxLoaderFinder = makeLoaderFinder('@mdx-js/loader');

module.exports = {
  fileLoaderFinder,
  babelLoaderFinder,
  mdxLoaderFinder,
};
