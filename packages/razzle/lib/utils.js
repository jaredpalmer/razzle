'use strict';

const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('../config/paths');
const printErrors = require('razzle-dev-utils/printErrors');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

exports.getRazzleConfig = function getRazzleConfig(env) {
  let razzle = {};
  if (fs.existsSync(paths.appRazzleConfig)) {
    try {
      razzle = require(paths.appRazzleConfig);
    } catch (e) {
      if (env === 'dev') {
        clearConsole();
        logger.error('Invalid razzle.config.js file.', e);
        process.exit(1);
      }
    }
  }
  return razzle;
};

exports.compile = function compile(webpackConfig) {
  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch (e) {
    printErrors('Failed to compile.', [e]);
    process.exit(1);
  }
  return compiler;
};
