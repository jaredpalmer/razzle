'use strict';

const webpackMajor = require('./webpackMajor');
const chalk = require('chalk');

/**
* Print an array of errors to console.
*
* @param {string} summary Summary of error
* @param {Array<Error>} errors Array of Errors
*/
function printErrors(summary, errors, verbose) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    if (webpackMajor < 5) {
      // webpack 4 format
      console.error(err);
    } else {
      if (err.message) {
        console.error(err.message);
      }
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    }
    console.log();
  });
}

module.exports = printErrors;
