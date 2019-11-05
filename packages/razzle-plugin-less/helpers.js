'use strict';
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const cssLoaderFinder = makeLoaderFinder('css-loader');
const postCssLoaderFinder = makeLoaderFinder('postcss-loader');
const resolveUrlLoaderFinder = makeLoaderFinder('resolve-url-loader');
const lessLoaderFinder = makeLoaderFinder('less-loader');
const styleLoaderFinder = makeLoaderFinder('style-loader');

module.exports = {
  cssLoaderFinder,
  postCssLoaderFinder,
  resolveUrlLoaderFinder,
  lessLoaderFinder,
  styleLoaderFinder,
};
