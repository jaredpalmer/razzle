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
 const formatWebpackMessages = require('razzle-dev-utils/formatWebpackMessages');
 const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

const argv = process.argv.slice(2);
const cliArgs = mri(argv);

loadRazzleConfig(webpack).then(
  async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {

    const verbose = razzleOptions.verbose;
    const clientOnly = razzleOptions.buildType=='spa';
    process.env.BUILD_TYPE = razzleOptions.buildType;

    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuildPublic)
      .then(async previousFileSizes => {
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
          printErrors('Failed to compile.', err, verbose);
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
             return reject(err);
          }
          const clientMessages = clientStats.toJson({}, true);
          if (clientMessages.errors.length) {
            return reject(clientMessages.errors);
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
            return reject(clientMessages.warnings);
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
                return reject(err);
              }
              const serverMessages =  serverStats.toJson({}, true);
              if (serverMessages.errors.length) {
                return reject(serverMessages.errors);
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
                return reject(serverMessages.warnings);
              }
              console.log(chalk.green('Compiled server successfully.'));
              return resolve({
                stats: clientStats,
                previousFileSizes,
                warnings: []
                  .concat(clientMessages.warnings)
                  .concat(serverMessages.warnings)
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
