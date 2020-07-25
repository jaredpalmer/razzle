'use strict';

const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const logger = require('./logger');

let WEBPACK_COMPILING = false;
let WEBPACK_DONE = false;

// This is a custom Webpack Plugin that prints out prettier console messages
// and errors depending on webpack compiler events. It runs on the Node.js
// server webpack instance.
class WebpackErrorsPlugin {
  constructor(options) {
    options = options || {};
    this.verbose = options.verbose;
    this.onSuccessMessage = options.onSuccessMessage;
    this.target = options.target === 'web' ? 'CLIENT' : 'SERVER';
  }

  apply(compiler) {
    compiler.plugin('done', stats => {
      const rawMessages = stats.toJson({}, true);
      const messages = formatWebpackMessages(rawMessages);
      WEBPACK_COMPILING = false;
      if (!messages.errors.length && !messages.warnings.length) {
        if (!WEBPACK_DONE) {
          if (!this.verbose) {
            clearConsole();
          }
          logger.done('Compiled successfully');
          WEBPACK_DONE = true;

          if (this.onSuccessMessage) {
            logger.log(this.onSuccessMessage);
            logger.log('');
          }
        }
      }

      if (
        messages.errors.length &&
        !(
          rawMessages.errors &&
          rawMessages.errors.length > 0 &&
          (rawMessages.errors[0].includes('assets.json') ||
            rawMessages.errors[0].includes('chunks.json') ||
            rawMessages.errors[0].includes("Module not found: Can't resolve"))
        )
      ) {
        messages.errors.forEach(e => {
          logger.error(
            `Failed to compile ${this.target} with ${messages.errors.length} errors`,
            e
          );
        });
        // return;
      }

      if (messages.warnings.length) {
        logger.warn(
          `Failed to compile with ${messages.warnings.length} warnings`
        );
        messages.warnings.forEach(w => logger.log(w));
      }
    });

    compiler.plugin('invalid', params => {
      WEBPACK_DONE = false;
      if (!WEBPACK_COMPILING) {
        if (!this.verbose) {
          clearConsole();
        }
        logger.start('Compiling...');
        WEBPACK_COMPILING = true;
      }
    });
  }
}

module.exports = WebpackErrorsPlugin;
