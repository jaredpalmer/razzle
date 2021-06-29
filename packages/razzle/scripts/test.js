// @remove-on-eject-begin
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
// @remove-on-eject-end
'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Ensure environment variables are read.
require('../config/env');

const jest = require('jest');
let argv = process.argv.slice(2);

// Watch unless on CI, in coverage mode, or user has specified --watchAll
if (
  !process.env.CI &&
  argv.indexOf('--coverage') < 0 &&
  argv.indexOf('--watchAll') < 0
) {
  if (!argv.includes('--no-watch')) {
    argv.push('--watch');
  } else {
    argv=argv.filter(x=>x!=='--no-watch')
  }
}

const webpack = require('webpack');
const loadRazzleConfig = require('../config/loadRazzleConfig');
const createJestConfig = require('../config/createJestConfig');
const path = require('path');
const fs = require('fs-extra');
const defaultPaths = require('../config/paths');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  clearConsole();
  logger.error('Unexpected error', err);
  process.exit(1);
});

loadRazzleConfig(webpack, defaultPaths).then(
  async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
    argv.push(
      '--config',
      JSON.stringify(
        await createJestConfig(
          relativePath => path.resolve(__dirname, '..', relativePath),
          path.resolve(paths.appSrc, '..'),
          razzle,
          razzleOptions,
          webpackObject,
          plugins,
          paths
        )
      )
    );

    jest.run(argv);
  }
);
