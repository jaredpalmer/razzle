'use strict';

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
    if (verbose) {
      console.log(err);
    }
    else {
      console.log(err.message || err);
    }
    console.log();
  });
}

module.exports = printErrors;
