'use strict';
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const htmlLoaderFinder = makeLoaderFinder('html-loader');
const markdownLoaderFinder = makeLoaderFinder('markdown-loader');

module.exports = {
  htmlLoaderFinder,
  markdownLoaderFinder,
};