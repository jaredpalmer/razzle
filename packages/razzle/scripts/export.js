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

loadRazzleConfig(webpack).then(
  async ({ razzle, webpackObject, plugins, paths }) => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuildPublic + '/')
      .then(previousFileSizes => {
        if (!fs.existsSync(paths.appBuildStaticExport)) {
          console.log(chalk.red('Failed to export static.\n'));
          console.log(
            'No ' + path.basename(paths.appBuildStaticExport) + ' found in ' +
              path.dirname(paths.appBuildStaticExport) +
              ', run build before export.\n' +
              '\n'
          );
          process.exit(1);
        }
        // Start the webpack build
        return static_export(previousFileSizes);
      })
      .then(
        ({ stats, previousFileSizes }) => {
          console.log(chalk.green('Exported static successfully.\n'));
          console.log('File sizes after gzip:\n');
          printFileSizesAfterBuild(stats, previousFileSizes, paths.appBuild);
          console.log();
        },
        err => {
          console.log(chalk.red('Failed to export static.\n'));
          console.log((err.message || err) + '\n');
          process.exit(1);
        }
      );

    async function static_export(previousFileSizes) {

      if (!fs.existsSync(paths.appBuildStaticExport)) {
        console.log(chalk.red('Failed to export static.\n'));
        console.log(
          'No ' + path.basename(paths.appBuildStaticExport) + ' found in ' + path.dirname(paths.appBuildStaticExport) + '.\n' + '\n'
        );
        process.exit(1);
      }

      const static_export_entrypoint = require(paths.appBuildStaticExport);

      const render_export =
        (razzle.experimental &&
          razzle.experimental.static_export &&
          razzle.experimental.static_export.render_export) ||
        'render';

      const imported_render = static_export_entrypoint[render_export];

      const routes_export =
        (razzle.experimental &&
          razzle.experimental.static_export &&
          razzle.experimental.static_export.routes_export) ||
        'routes';

      const imported_routes = static_export_entrypoint[routes_export];

      if (!imported_routes) {
        console.log(chalk.red('Failed to export static.\n'));
        console.log(
        'No ' +
          routes_export +
          ' export found in ' +
          paths.appBuildStaticExport +
          '.\n' +
          '\n'
        );
        process.exit(1);
      }

      if (!imported_render) {
        console.log(chalk.red('Failed to export static.\n'));
        console.log(
          'No ' +
            render_export +
            ' export found in ' +
            paths.appBuildStaticExport +
            '.\n' +
            '\n'
        );
        process.exit(1);
      }

      const routes =
        typeof imported_routes == 'function'
          ? await imported_routes()
          : imported_routes;

      const render_static_export = async pathname => {
        const json = ({ html, data }) => {
          const outputDir = path.join(paths.appBuildPublic, pathname);
          const htmlFile = path.join(outputDir, 'index.html');
          const pageDataFile = path.join(outputDir, 'page-data.json');

          fs.ensureDirSync(outputDir);
          fs.outputFileSync(htmlFile, html);
          if (!!data) {
            fs.outputFileSync(pageDataFile, JSON.stringify(data));
          }
        };

        const req = { url: pathname };
        const res = { json };
        await imported_render(req, res);
      };

      await asyncPool(Math.min(2, routes.lenght), routes, render_static_export);
      await fs.writeFile(paths.appBuildStaticExportRoutes,'window.RAZZLE_STATIC_ROUTES = ' + JSON.stringify(routes));
      const stats = await getFileNamesAsStat(paths.appBuildPublic + '/');
      return { stats, previousFileSizes };
    }
  }
);
