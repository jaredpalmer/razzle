#! /usr/bin/env node
'use strict';

const mri = require('mri');

const argv = process.argv.slice(2);
const cliArgs = mri(argv);

const nodeEnv = cliArgs['node-env'] || 'production';
const mode = cliArgs['watch'] ? 'watch' : 'run';

// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = /production|staging|development$/.test(nodeEnv) ? nodeEnv : 'production';

const webpack = require('webpack');
const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');
const createConfig = require('../config/createConfigAsync');
const loadRazzleConfig = require('../config/loadRazzleConfig');
const printErrors = require('razzle-dev-utils/printErrors');
const printWarnings = require('razzle-dev-utils/printWarnings');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');
const FileSizeReporter = require('razzle-dev-utils/FileSizeReporter');
const formatWebpackMessages = require('razzle-dev-utils/formatWebpackMessages');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  clearConsole();
  logger.error('Unexpected error', err);
  process.exit(1);
});

loadRazzleConfig(webpack).then(
  async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
    const verbose = razzleOptions.verbose;
    if (!verbose) {
      process.removeAllListeners('warning');
    }
    if (!process.env.CI && process.env.NODE_ENV === "production" && (process.env.RAZZLE_NONINTERACTIVE !== "true" && !cliArgs['noninteractive'])) {
      await inquirer.prompt([
        {
          type: 'confirm',
          name: 'run',
          message: 'This runs the production build, are you sure you want to run it?\nAdd --noninteractive to remove this prompt.',
        }
      ]).then((answers) => {
        if (answers.run === false) {
          process.exit(1);
        }
      });
    }

    const clientOnly = /spa|single\-page\-application/.test(
      razzleOptions.buildType
    );
    const serverOnly = /serveronly|server\-only/.test(razzleOptions.buildType);

    process.env.BUILD_TYPE = razzleOptions.buildType;

    const clientBuilds = ['default'];
    const serverBuilds = ['default'];

    const clientBuildProceedFrom = 'default';
    const serverBuildProceedFrom = 'default';

    const runBuildPromisesInSeries = ps =>
      ps.reduce(
        (p, next) =>
          p.then(next).catch((buildName, target) => {
            process.exit(1);
          }),
        Promise.resolve()
      );

    if (!serverOnly) {
      const clientResults = await runBuildPromisesInSeries(
        clientBuilds
          .slice(clientBuilds.indexOf(clientBuildProceedFrom))
          .map(buildName => {
            return () => {
              return new Promise((resolveBuild, rejectBuild) => {
                const build = async previousFileSizes => {
                  return new Promise(async (resolve, reject) => {
                    // Create our production webpack configurations and pass in razzle options.
                    const clientConfig = await createConfig(
                      'web',
                      'prod',
                      razzle,
                      webpackObject,
                      clientOnly,
                      paths,
                      plugins,
                      razzleOptions
                    );

                    console.log(`Compiling client ${buildName} build...\n`);
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

                      return resolve({
                        stats: clientStats,
                        previousFileSizes,
                        warnings: clientMessages.warnings,
                      });
                    }, (err) => {
                      return reject(err);
                    });
                  });
                };
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
                        printWarnings(
                          `Client ${buildName} build compiled with warnings\n`,
                          warnings,
                          verbose
                        );
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
                        console.log(
                          chalk.green(
                            `Compiled client ${buildName} build successfully.\n`
                          )
                        );
                      }
                      console.log('File sizes after gzip:\n');
                      printFileSizesAfterBuild(
                        stats,
                        previousFileSizes,
                        paths.appBuild
                      );
                      console.log();
                      resolveBuild();
                    },
                    err => {
                      printErrors(
                        `Failed to compile client ${buildName} build.`,
                        Array.isArray(err) ? err : [err],
                        verbose
                      );
                      rejectBuild(buildName, 'web');
                    }
                  );
              });
            };
          })
      );
    }

    if (!clientOnly) {
      const serverResults = await runBuildPromisesInSeries(
        serverBuilds
          .slice(serverBuilds.indexOf(serverBuildProceedFrom))
          .map(buildName => {
            return () => {
              return new Promise((resolveBuild, rejectBuild) => {
                const build = async () => {
                  return new Promise(async (resolve, reject) => {
                    // Create our production webpack configurations and pass in razzle options.
                    const serverConfig = await createConfig(
                      'node',
                      'prod',
                      razzle,
                      webpackObject,
                      serverOnly,
                      paths,
                      plugins,
                      razzleOptions
                    );

                    console.log(`Compiling server ${buildName} build...\n`);

                    compile(serverConfig, (err, serverStats) => {
                      if (err) {
                        return reject(err);
                      }
                      const serverMessages = serverStats.toJson({}, true);
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

                      return resolve({
                        stats: serverStats,
                        warnings: serverMessages.warnings,
                      });
                    }, (err) => {
                      return reject(err);
                    });
                  });
                };

                build().then(
                  ({ stats, warnings }) => {
                    if (warnings.length) {
                      printWarnings(
                        `Server ${buildName} build compiled with warnings\n`,
                        warnings,
                        verbose
                      );
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
                      console.log(
                        chalk.green(
                          `Compiled server ${buildName} build successfully.\n`
                        )
                      );
                    }
                    resolveBuild();
                  },
                  err => {
                    printErrors(
                      `Failed to compile server ${buildName} build.`,
                      Array.isArray(err) ? err : [err],
                      verbose
                    );
                    rejectBuild(buildName, 'node');
                  }
                );
              });
            };
          })
      );
    }
    // Wrap webpackcompile in a try catch.
    function compile(config, cb, internal_error_cb) {
      let compiler;
      try {
        compiler = webpackObject(config);
      } catch (e) {
        printErrors('Failed to compile.', [e], verbose);
        return internal_error_cb(e);
      }
      compiler.run((err, stats) => {
        cb(err, stats);
      });
    }
  }
);
