#! /usr/bin/env node
'use strict';
// Do this as the first thing so that any code reading it knows the right env.
process.env.NODE_ENV = 'production';

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

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  clearConsole();
  logger.error('Unexpected error', err);
  process.exit(1);
});

const argv = process.argv.slice(2);
const cliArgs = mri(argv);

loadRazzleConfig(webpack).then(
  async ({ razzle, razzleOptions, webpackObject, plugins, paths }) => {
    // First, read the current file sizes in build directory.
    // This lets us display how much they changed later.
    measureFileSizesBeforeBuild(paths.appBuildPublic)
      .then(previousFileSizes => {
        if (!fs.existsSync(paths.appBuildStaticExport)) {
          console.log(chalk.red('Failed to export static.\n'));
          console.log(
            'No ' +
              path.basename(paths.appBuildStaticExport) +
              ' found in ' +
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
      const options = razzleOptions.staticExport || {};

      if (!fs.existsSync(paths.appBuildStaticExport)) {
        console.log(chalk.red('Failed to export static.\n'));
        console.log(
          'No ' +
            path.basename(paths.appBuildStaticExport) +
            ' found in ' +
            path.dirname(paths.appBuildStaticExport) +
            '.\n' +
            '\n'
        );
        process.exit(1);
      }

      const static_export_entrypoint = require(paths.appBuildStaticExport);

      const imported_render =
        static_export_entrypoint[options.renderExport || 'render'];

      const imported_routes =
        static_export_entrypoint[options.routesExport || 'routes'];

      if (!imported_routes) {
        console.log(chalk.red('Failed to export static.\n'));
        console.log(
          'No ' + options.routesExport ||
            'routes' +
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
          'No ' + options.renderExport ||
            'render' +
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

      const insertScript = `\$1<script src="${process.env.PUBLIC_PATH ||
        '/'}static_routes.js" defer crossorigin></script>`;
      const insertScriptRe = /(<body.*?>)/ims;

      const render_static_export = async pathname => {
        let htmlFile, hasData;
        const json = ({ html, data, error = null }) => {
          if (error) console.error(error);
          const outputDir = path.join(paths.appBuildPublic, pathname);
          const pageDataFile = path.join(outputDir, 'page-data.json');
          htmlFile = path.join(outputDir, 'index.html');

          fs.ensureDirSync(outputDir);
          fs.outputFileSync(
            htmlFile,
            !options.scriptInline
              ? html.replace(insertScriptRe, insertScript)
              : html
          );
          hasData = !!data;
          if (hasData) {
            console.log(chalk.green(`Data written for ${pathname}.`), data);
            fs.outputFileSync(pageDataFile, JSON.stringify(data));
          }
        };

        const req = { url: pathname };
        const res = { json };
        await imported_render(req, res);
        return { pathname, htmlFile, hasData };
      };

      const rendersInfo = await asyncPool(
        Math.min(options.parallel || 5, routes.length),
        routes,
        render_static_export
      );

      const exportDataRoutes = rendersInfo
        .filter(info => info.hasData)
        .map(info => info.pathname);

      const insertScriptCode =
        `window.${options.windowRoutesVariable || 'RAZZLE_STATIC_ROUTES'}` +
        ` =  ${JSON.stringify(
          routes.map(route => route.replace(/^\/|\/$/g, ''))
        )};\n` +
        `window.${options.windowRoutesDataVariable ||
          'RAZZLE_STATIC_DATA_ROUTES'}` +
        ` =  ${JSON.stringify(
          exportDataRoutes.map(route => route.replace(/^\/|\/$/g, ''))
        )};\n`;

      if (!options.scriptInline) {
        await fs.writeFile(paths.appBuildStaticExportRoutes, insertScriptCode);
      } else {
        const insertScriptInline = `\$1<script>${insertScriptCode}</script>`;
        const updateFile = htmlFile => {
          fs.pathExists(htmlFile).then(exists => {
            if (exists) {
              fs.readFile(htmlFile).then(content => {
                const contentString = content.toString();
                const updated = contentString.replace(
                  insertScriptRe,
                  insertScriptInline
                );
                return fs.writeFile(htmlFile, updated);
              });
            }
          });
        };

        const exportHtmlFiles = rendersInfo.map(info => info.htmlFile);

        await asyncPool(
          Math.min(options.parallel || 5, exportHtmlFiles.length),
          exportHtmlFiles,
          updateFile
        );
      }

      const stats = await getFileNamesAsStat(paths.appBuildPublic);
      return { stats, previousFileSizes };
    }
  }
);
