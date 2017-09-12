'use strict';

const chalk = require('chalk');
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
      if (!messages.errors.length && !messages.warnings.length) {
        if (this.onSuccessMessage) {
          logger.log(this.onSuccessMessage);
          logger.log('');
        }
      }

      if (
        messages.errors.length &&
        !(
          rawMessages.errors &&
          rawMessages.errors.length > 0 &&
          (rawMessages.errors[0].includes('assets.json') ||
            rawMessages.errors[0].includes("Module not found: Can't resolve"))
        )
      ) {
        messages.errors.forEach(e => {
          logger.error(
            `Failed to compile ${this.target} with ${messages.errors
              .length} errors`,
            e
          );
        });
      }

      if (messages.warnings.length) {
        logger.warn(
          `Compiled ${this.target} with ${messages.warnings.length} warnings`
        );
        messages.warnings.forEach(w => logger.log(w));
      }
    });
  }
}

module.exports = WebpackErrorsPlugin;
