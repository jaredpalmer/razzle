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
const path = require('path');
const chalk = require('chalk');
const asyncPool = require('tiny-async-pool');
const loadRazzleConfig = require('../config/loadRazzleConfig');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');
const FileSizeReporter = require('razzle-dev-utils/FileSizeReporter');
const measureFileSizesBeforeBuild =
  FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const getFileNamesAsStat = FileSizeReporter.getFileNamesAsStat;

const argv = process.argv.slice(2);
const cliArgs = mri(argv);

cliArgs.routes = cliArgs.routes || 'routes.json';

loadRazzleConfig(webpack).then(
  async ({ razzle, webpackObject, plugins, paths }) => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuildPublic+'/')
      .then(previousFileSizes => {
        if (!fs.existsSync(path.join(paths.appBuild, 'prerender.js'))) {
          console.log(chalk.red('Failed to prerender.\n'));
          console.log('No prerender.js found in ' + paths.appBuild + ', run build before prerender.\n' + '\n');
          process.exit(1);
        }
        // Start the webpack build
        return prerender(previousFileSizes);
      })
      .then(
        ({ stats, previousFileSizes }) => {
          console.log(chalk.green('Prerendered successfully.\n'));
          console.log('File sizes after gzip:\n');
          printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
          console.log();
        },
        err => {
          console.log(chalk.red('Failed to prerender.\n'));
          console.log((err.message || err) + '\n');
          process.exit(1);
        }
      );

    function prerender(previousFileSizes) {
      const prerender_entrypoint = require(path.join(paths.appBuild, 'prerender.js'));
      const render_export = razzle.experimental &&
        razzle.experimental.prerender &&
        razzle.experimental.prerender.export ||
        'render';
      const render = prerender_entrypoint[render_export];

      const routesPath = path.join(paths.appPath, cliArgs.routes);

      if (!fs.existsSync(routesPath)) {
        console.log(chalk.red('Failed to prerender.\n'));
        console.log('No ' + cliArgs.routes + ' found in ' + paths.appPath + '.\n' + '\n');
        process.exit(1);
      }

      const imported_routes = require(routesPath);
      const routes = typeof imported_routes == 'function' ? imported_routes() : imported_routes;

      if (!render) {
        console.log(chalk.red('Failed to prerender.\n'));
        console.log('No ' + render_export + ' export found in ' + path.join(paths.appBuild, 'prerender.js') + '.\n' + '\n');
        process.exit(1);
      }

      return new Promise(async (resolve, reject) => {
        const prerender = route => new Promise(async (resolve) => {
          render({url:route}, {send: (data) => {
            const outputDir = path.join(paths.appBuildPublic, route);
            const outputFile = path.join(outputDir, 'index.html');
            fs.ensureDir(outputDir).then(()=>{
              fs.outputFile(outputFile, data).then(()=>{
                resolve();
              })
            })
          }})
        });
        await asyncPool(Math.min(2, routes.lenght), routes, prerender);
        const stats = await getFileNamesAsStat(paths.appBuildPublic+'/');
        resolve({ stats, previousFileSizes })
      });
    }
  }
);
