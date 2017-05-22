#! /usr/bin/env node

process.env.NODE_ENV = 'development';
const webpack = require('webpack');
const paths = require('../config/paths');
const printErrors = require('../config/printErrors');
const createConfig = require('../config/create-config');
const devServer = require('webpack-dev-server');
const chalk = require('chalk');
const clearConsole = require('react-dev-utils/clearConsole');
const fs = require('fs-extra');
const logger = require('../config/logger');

process.noDeprecation = true; // turns off that loadQuery clutter.

// Optimistically, we make the console look exactly like the output of our
// FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
// clearConsole();
logger.start('Compiling...');
let razzle = {};

// Check for razzle.config.js file
if (fs.existsSync(paths.appRazzleConfig)) {
  try {
    razzle = require(paths.appRazzleConfig);
  } catch (e) {
    clearConsole();
    logger.error('Invalid razzle.config.js file.', e);
    process.exit(1);
  }
}

// Create dev configs using our config factory, passing in razzle file as
// options.
let clientConfig = createConfig('web', 'dev', razzle);
let serverConfig = createConfig('node', 'dev', razzle);

// Check if razzle.config has a modify function. If it does, call it on the
// configs we just created.
if (razzle.modify) {
  clientConfig = razzle.modify(
    clientConfig,
    { target: 'web', dev: true },
    webpack
  );
  serverConfig = razzle.modify(
    serverConfig,
    { target: 'node', dev: true },
    webpack
  );
}

const serverCompiler = compile(serverConfig);

// Start our server webpack instance in watch mode.
serverCompiler.watch(
  {
    quiet: true,
    stats: 'none',
  },
  stats => {}
);

// Compile our assets with webpack
const clientCompiler = compile(clientConfig);

// Create a new instance of Webpack-dev-server for our client assets.
// This will actually run on a different port than the users app.
const clientDevServer = new devServer(clientCompiler, clientConfig.devServer);

// Start Webpack-dev-server
clientDevServer.listen(
  (process.env.PORT && parseInt(process.env.PORT) + 1) || razzle.port || 3001,
  err => {
    if (err) {
      logger.error(err);
    }
  }
);

// Webpack compile in a try-catch
function compile(config) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    printErrors('Failed to compile.', [e]);
    process.exit(1);
  }
  return compiler;
}
