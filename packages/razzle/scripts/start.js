#! /usr/bin/env node

process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('../config/paths');
const createConfig = require('../config/createConfig');
const webpackDevServer = require('webpack-dev-server');
const printErrors = require('razzle-dev-utils/printErrors');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');
const cluster = require('cluster');

process.noDeprecation = true; // turns off that loadQuery clutter.

if (process.argv.includes('--inspect')) {
  process.env.INSPECT_ENABLED = true;
}

// clearConsole();

let razzle = {};

// Check for razzle.config.js file
if (fs.existsSync(paths.appRazzleConfig)) {
  try {
    razzle = require(paths.appRazzleConfig);
  } catch (e) {
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

let multiCompiler;
try {
  multiCompiler = webpack([clientConfig, serverConfig]);
} catch (e) {
  printErrors('Failed to compile.', [e]);
  process.exit(1);
}

// This will listen to any console events send by the compiled server and redirect to them to ours
const workers = new Map();
cluster.on('online', () => {
  for (const worker in cluster.workers) {
    // check if we didn't already hook this worker yet
    if (!workers.has(worker)) {
      workers.set(worker, null);
      cluster.workers[worker].on('message', message => {
        if (message.cmd === 'console') {
          console[message.type](...message.args);
        }
      });
    }
  }
});

// Create a new instance of Webpack-dev-server.
// This will actually run on a different port than the users app.

const devServer = new webpackDevServer(multiCompiler, clientConfig.devServer);

// Start Webpack-dev-server
devServer.listen(
  (process.env.PORT && parseInt(process.env.PORT) + 1) || razzle.port || 3001,
  err => {
    if (err) {
      logger.error(err);
    }
  }
);

// We only start requiring CompilationStatus here, because it will start redirecting console output once it's required.
// We only want this to happen after webpack & the devserver have successfully booted up.
const CompilationStatus = require('razzle-dev-utils/CompilationStatus');
CompilationStatus.startRender(multiCompiler.compilers);
