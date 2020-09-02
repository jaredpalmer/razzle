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

const webpack = require('webpack');
const mri = require('mri');
const fs = require('fs-extra');
const chalk = require('chalk');
const createConfig = require('../config/createConfigAsync');
const loadRazzleConfig = require('../config/loadRazzleConfig');
const printErrors = require('razzle-dev-utils/printErrors');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');
const FileSizeReporter = require('razzle-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const argv = process.argv.slice(2);
const cliArgs = mri(argv);
// Set the default build mode to isomorphic
cliArgs.type = cliArgs.type || 'iso';
const clientOnly = cliArgs.type === 'spa';
// Capture the type (isomorphic or single-page) as an environment variable
process.env.BUILD_TYPE = cliArgs.type;

const verbose = cliArgs.verbose || false;

loadRazzleConfig(webpack).then(
  async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuildPublic)
      .then(previousFileSizes => {
        // Remove all content but keep the directory so that
        // if you're in it, you don't end up in Trash
        fs.emptyDirSync(paths.appBuild);

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

      return new Promise(async (resolve, reject) => {
        let serverConfig;
        let clientConfig;
        // Create our production webpack configurations and pass in razzle options.
        clientConfig = await createConfig(
          'web',
          'prod',
          razzle,
          webpackObject,
          clientOnly,
          paths,
          plugins,
          razzleOptions
        );

        if (!clientOnly) {
          serverConfig = await createConfig(
            'node',
            'prod',
            razzle,
            webpackObject,
            clientOnly,
            paths,
            plugins,
            razzleOptions
          );
        }

        process.noDeprecation = true; // turns off that loadQuery clutter.

        console.log('Creating an optimized production build...');
        console.log('Compiling client...');
        // First compile the client. We need it to properly output assets.json (asset
        // manifest) and chunks.json (chunk manifest) files with the correct hashes on file names BEFORE we can start
        // the server compiler.
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
            !process.env.WARNINGS_ERRORS_DISABLE &&
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
          if (clientOnly) {
            return resolve({
              stats: clientStats,
              previousFileSizes,
              warnings: clientMessages.warnings,
            });
          } else {
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
                !process.env.WARNINGS_ERRORS_DISABLE &&
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
          }
        });
      });
    }

    // Wrap webpackcompile in a try catch.
    function compile(config, cb) {
      let compiler;
      try {
        compiler = webpackObject(config);
      } catch (e) {
        printErrors('Failed to compile.', [e], verbose);
        process.exit(1);
      }
      compiler.run((err, stats) => {
        cb(err, stats);
      });
    }
  }
);
