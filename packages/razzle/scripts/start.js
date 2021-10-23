#! /usr/bin/env node
'use strict';

process.env.NODE_ENV = 'development';
const fs = require('fs-extra');
const mri = require('mri');
const webpack = require('webpack');
const createConfig = require('../config/createConfigAsync');
const loadRazzleConfig = require('../config/loadRazzleConfig');
const devServer = require('../config/razzleDevServer');
const printErrors = require('razzle-dev-utils/printErrors');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');
const setPorts = require('razzle-dev-utils/setPorts');
const chalk = require('chalk');
const terminate = require('terminate');
const devServerMajorVersion = require('razzle-dev-utils/devServerMajor');

let verbose = false;

process.once('SIGINT', () => {
  if (verbose) {
    console.error(chalk.bgRedBright(' SIGINT '), chalk.redBright('exiting...'));
  }
  terminate(process.pid, 'SIGINT', { timeout: 1000 }, () => {
    if (verbose) {
      console.error(chalk.bgGreen(' Goodbye '));
    }
    terminate(process.pid);
  });
});

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  clearConsole();
  logger.error('Unexpected error', err);
  process.exit(1);
});

process.noDeprecation = true; // turns off that loadQuery clutter.

const argv = process.argv.slice(2);
const cliArgs = mri(argv);
// Capture any --inspect or --inspect-brk flags (with optional values) so that we
// can pass them when we invoke nodejs
process.env.INSPECT_BRK = formatInspectFlag(cliArgs, 'inspect-brk');
process.env.INSPECT = formatInspectFlag(cliArgs, 'inspect');

function main() {
  return new Promise(async (resolve, reject) => {
    loadRazzleConfig(webpack)
      .then(
        async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
          verbose = razzleOptions.verbose;
          if (!verbose) {
            process.removeAllListeners('warning');
          }
          const clientOnly = /spa|single-page-application/.test(
            razzleOptions.buildType
          );
          const serverOnly = /serveronly|server-only/.test(
            razzleOptions.buildType
          );

          process.env.BUILD_TYPE = razzleOptions.buildType;

          setPorts(clientOnly).then(async () => {
            // Optimistically, we make the console look exactly like the output of our
            // FriendlyErrorsPlugin during compilation, so the user has immediate feedback.
            // clearConsole();
            logger.start('Compiling...');

            let clientCompiler;
            let clientConfig; // Create dev configs using our config factory, passing in razzle file as
            // options.
            if (!serverOnly) {
              clientConfig = await createConfig(
                'web',
                'dev',
                razzle,
                webpackObject,
                clientOnly,
                paths,
                plugins,
                razzleOptions
              );
              if (clientOnly) {
                // Check for public/index.html file
                if (!fs.existsSync(paths.appHtml)) {
                  clearConsole();
                  logger.error(`index.html dose not exists public folder.`);
                  process.exit(1);
                }
              }

              // Delete assets.json to always have a manifest up to date
              fs.removeSync(paths.appAssetsManifest);

              clientCompiler = compile(clientConfig, verbose);
            }
            let serverCompiler;
            let serverConfig;
            if (!clientOnly) {
              serverConfig = await createConfig(
                'node',
                'dev',
                razzle,
                webpackObject,
                clientOnly,
                paths,
                plugins,
                razzleOptions
              );
              serverCompiler = compile(serverConfig, verbose);
            }

            const port =
              ((clientConfig || {}).devServer || {}).port || process.env.PORT;

            // Compile our assets with webpack
            // Instatiate a variable to track server watching
            let watching;
            let clientDevServer;

            // in SPA mode we want to give the user
            // feedback about the port that app is running on
            // this variable helps us to don't show
            // the message multiple times ...
            let logged = false;

            // Start our server webpack instance in watch mode after assets compile
            if (clientCompiler) {
              clientCompiler.hooks.done.tap('razzle', () => {
                // If we've already started the server watcher, bail early.
                if (watching) {
                  return;
                }

                if (!clientOnly && serverCompiler) {
                  // Otherwise, create a new watcher for our server code.
                  watching = serverCompiler.watch(
                    {
                      quiet: !verbose,
                      stats: 'none',
                    },
                    /* eslint-disable no-unused-vars */
                    stats => {}
                  );
                }

                // in SPA mode we want to give the user
                // feedback about the port that app is running on
                if (clientOnly && !logged) {
                  logged = true;
                  console.log(chalk.green(`> SPA Started on port ${port}`));
                }
              });
            } else {
              watching = serverCompiler.watch(
                {
                  quiet: !verbose,
                  stats: 'none',
                },
                /* eslint-disable no-unused-vars */
                stats => {}
              );
            }

            // Provide a reusable logger function
            const errorLogger = (err) => {
              if (err) {
                logger.error(err);
              }
            };

            if (!serverOnly) {
              // Create a new instance of Webpack-dev-server for our client assets.
              // This will actually run on a different port than the users app.
              clientDevServer = new devServer(
                clientCompiler,
                Object.assign(clientConfig.devServer, { verbose, port }),
              );
              if (devServerMajorVersion > 3) {
                // listen was deprecated in v4 and causes issues when used, switch to its replacement
                clientDevServer.startCallback(errorLogger);
              } else {
                // Start Webpack-dev-server
                clientDevServer.listen(port, errorLogger);
              }
            }

            ['SIGINT', 'SIGTERM'].forEach(sig => {
              process.on(sig, () => {
                if (clientDevServer) {
                  if (devServerMajorVersion > 3) {
                    // close was deprecated in v4, switch to its replacement
                    clientDevServer.stopCallback(errorLogger);
                  } else {
                    clientDevServer.close(errorLogger);
                  }
                }
                if (watching) {
                  watching.close();
                }
              });
            });

            resolve();
          });
        }
      )
      .catch(console.error);
  });
}

// Webpack compile in a try-catch
function compile(config, verbose) {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (e) {
    printErrors('Failed to compile.', [e], verbose);
    process.exit(1);
  }
  return compiler;
}

function formatInspectFlag(cliArgs, flag) {
  const value = cliArgs[flag];

  if (typeof value === 'undefined' || value === '') {
    return '';
  }

  // When passed as `--inspect`.
  if (value === true) {
    return '--' + flag;
  }

  // When passed as `--inspect=[port]` or `--inspect=[host:port]`
  return '--' + flag + '=' + value.toString();
}

main();
