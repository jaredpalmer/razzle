'use strict';
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const babelLoaderFinder = makeLoaderFinder('babel-loader');
const tsLoaderFinder = makeLoaderFinder('ts-loader');
const eslintLoaderFinder = makeLoaderFinder('eslint-loader');

module.exports = {
  eslintLoaderFinder,
  babelLoaderFinder,
  tsLoaderFinder,
};
