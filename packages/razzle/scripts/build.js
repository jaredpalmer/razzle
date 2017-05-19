#! /usr/bin/env node
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const webpack = require('webpack');
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const paths = require('../config/paths');
const printErrors = require('../config/printErrors');
const createConfig = require('../config/create-config');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const logger = require('../config/logger');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuildPublic).then(previousFileSizes => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fs.emptyDirSync(paths.appBuild);

  // Start the webpack build
  build(previousFileSizes);

  // Merge with the public folder
  copyPublicFolder();
});

function build(previousFileSizes) {
  // Check if razzle.config.js exists
  let razzle = {};
  try {
    razzle = require(paths.appRazzleConfig);
  } catch (e) {}

  if (razzle.clearConsole === false || !!razzle.host || !!razzle.port) {
    logger.warn(`Specifying options \`port\`, \`host\`, and \`clearConsole\` in razzle.config.js has been deprecated. 
Please use a .env file instead.

${razzle.host !== 'localhost' && `HOST=${razzle.host}`}
${razzle.port !== '3000' && `PORT=${razzle.port}`}
`);
  }

  // Create our production webpack configurations and pass in razzle options.
  let clientConfig = createConfig('web', 'prod', razzle);
  let serverConfig = createConfig('node', 'prod', razzle);

  // Check if razzle.config has a modify function. If it does, call it on the
  // configs we just created.
  if (razzle.modify) {
    clientConfig = razzle.modify(
      clientConfig,
      { target: 'web', dev: false },
      webpack
    );
    serverConfig = razzle.modify(
      serverConfig,
      { target: 'node', dev: false },
      webpack
    );
  }

  process.noDeprecation = true; // turns off that loadQuery clutter.

  console.log('Creating an optimized production build...');
  console.log('Compiling client...');
  // First compile the client. We need it to properly output assets.json (asset
  // manifest file with the correct hashes on file names BEFORE we can start
  // the server compiler.
  compile(clientConfig, (err, clientStats) => {
    handleWebpackErrors(err, clientStats);
    console.log(chalk.green('Compiled client successfully.'));
    console.log('Compiling server...');
    compile(serverConfig, (err, serverStats) => {
      handleWebpackErrors(err, serverStats);
      console.log(chalk.green('Compiled server successfully.'));
      console.log();
      console.log('Client File sizes after gzip:');
      console.log();
      printFileSizesAfterBuild(clientStats, previousFileSizes);
      console.log();
      console.log('You can now start your server in production by running:');
      console.log();
      console.log(`   ${chalk.blue('node ./build/server.js')}`);
      console.log();
    });
  });
}

// Helper function to copy public directory to build/public
function copyPublicFolder() {
  fs.copySync(paths.appPublic, paths.appBuildPublic, {
    dereference: true,
    filter: file => file !== paths.appHtml,
  });
}

// Wrap webpack compile in a try catch.
function compile(config, cb) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    printErrors('Failed to compile.', [e]);
    process.exit(1);
  }
  compiler.run((err, stats) => {
    cb(err, stats);
  });
}

// Gracefully handle errors and print them to console.
function handleWebpackErrors(err, stats) {
  if (err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  if (stats.compilation.errors && stats.compilation.errors.length) {
    printErrors('Failed to compile.', stats.compilation.errors);
    process.exit(1);
  }
  if (
    process.env.CI &&
    stats.compilation.warnings &&
    stats.compilation.warnings.length
  ) {
    printErrors(
      'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
      stats.compilation.warnings
    );
    process.exit(1);
  }
}
