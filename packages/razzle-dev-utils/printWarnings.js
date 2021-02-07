'use strict';

const chalk = require('chalk');

/**
* Print an array of warnings to console.
*
* @param {string} summary Summary of error
* @param {Array<Warnings>} warnings Array of Warningss
*/
function printWarnings(summary, warnings, verbose) {
  console.log(chalk.yellow(summary));
  console.log();
  warnings.forEach(wrn => {
    if (wrn.message) {
      console.warn(wrn.message);
    }
    if (verbose) {
      console.warn(wrn.stack || wrn);
    }
    if (wrn.details) {
      console.warn(wrn.details);
    }
    console.log();
  });
}

module.exports = printWarnings;
