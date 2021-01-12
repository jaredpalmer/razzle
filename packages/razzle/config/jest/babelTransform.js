'use strict';

const babelJest = require('babel-jest');
const paths = require('../paths');
const fs = require('fs-extra');

const hasBabelRc = fs.existsSync(paths.appBabelRc);

const config = {
  presets: !hasBabelRc ? [require.resolve('babel-preset-razzle')] : [],
  babelrc: !!hasBabelRc,
};

module.exports = babelJest.createTransformer(config);
