#! /usr/bin/env node
'use strict';
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const webpack = require('webpack');
const fs = require('fs-extra');
const chalk = require('chalk');
const defaultPaths = require('../config/paths');
const createConfig = require('../config/createConfig');
const printErrors = require('razzle-dev-utils/printErrors');
const logger = require('razzle-dev-utils/logger');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

let razzle = {};

// Check for razzle.config.js file
if (fs.existsSync(defaultPaths.appRazzleConfig)) {
  try {
    razzle = require(defaultPaths.appRazzleConfig);
  } catch (e) {
    logger.error('Invalid razzle.config.js file.', e);
    process.exit(1);
  }
}

// Allow overriding paths
const paths = razzle.modifyPaths
  ? razzle.modifyPaths('prod', defaultPaths)
  : defaultPaths;

if (razzle.preCompile) {
  razzle.preCompile('prod');
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
measureFileSizesBeforeBuild(paths.appBuildPublic)
  .then(previousFileSizes => {
    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    fs.emptyDirSync(paths.appBuild);

    // Merge with the public folder
    copyPublicFolder();

    // Start the webpack build
    return build(previousFileSizes);
  })
  .then(
    ({ stats, previousFileSizes, warnings }) => {
      if (warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.\n'));
        console.log(warnings.join('\n\n'));
        console.log(
          '\nSearch for the ' +
            chalk.underline(chalk.yellow('keywords')) +
            ' to learn more about each warning.'
        );
        console.log(
          'To ignore, add ' +
            chalk.cyan('// eslint-disable-next-line') +
            ' to the line before.\n'
        );
      } else {
        console.log(chalk.green('Compiled successfully.\n'));
      }
      console.log('File sizes after gzip:\n');
      printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
      console.log();
    },
    err => {
      console.log(chalk.red('Failed to compile.\n'));
      console.log((err.message || err) + '\n');
      process.exit(1);
    }
  );

function build(previousFileSizes) {
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
  return new Promise((resolve, reject) => {
    compile(clientConfig, (err, clientStats) => {
      if (err) {
        reject(err);
      }
      const clientMessages = formatWebpackMessages(
        clientStats.toJson({}, true)
      );
      if (clientMessages.errors.length) {
        return reject(new Error(clientMessages.errors.join('\n\n')));
      }
      if (
        process.env.CI &&
        (typeof process.env.CI !== 'string' ||
          process.env.CI.toLowerCase() !== 'false') &&
        clientMessages.warnings.length
      ) {
        console.log(
          chalk.yellow(
            '\nTreating warnings as errors because process.env.CI = true.\n' +
              'Most CI servers set it automatically.\n'
          )
        );
        return reject(new Error(clientMessages.warnings.join('\n\n')));
      }

      console.log(chalk.green('Compiled client successfully.'));
      console.log('Compiling server...');
      compile(serverConfig, (err, serverStats) => {
        if (err) {
          reject(err);
        }
        const serverMessages = formatWebpackMessages(
          serverStats.toJson({}, true)
        );
        if (serverMessages.errors.length) {
          return reject(new Error(serverMessages.errors.join('\n\n')));
        }
        if (
          process.env.CI &&
          (typeof process.env.CI !== 'string' ||
            process.env.CI.toLowerCase() !== 'false') &&
          serverMessages.warnings.length
        ) {
          console.log(
            chalk.yellow(
              '\nTreating warnings as errors because process.env.CI = true.\n' +
                'Most CI servers set it automatically.\n'
            )
          );
          return reject(new Error(serverMessages.warnings.join('\n\n')));
        }
        console.log(chalk.green('Compiled server successfully.'));
        if (razzle.postCompile) {
          razzle.postCompile('prod');
        }
        return resolve({
          stats: clientStats,
          previousFileSizes,
          warnings: Object.assign(
            {},
            clientMessages.warnings,
            serverMessages.warnings
          ),
        });
      });
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
