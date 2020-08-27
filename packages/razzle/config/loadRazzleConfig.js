const fs = require('fs-extra');
const merge = require('deepmerge');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

const defaultPaths = require('./paths');
const defaultRazzleOptions = require('./defaultOptions');
const setupEnvironment = require('./env').setupEnvironment;
const loadPlugins = require('./loadPlugins');

module.exports = (webpackObject, razzleConfig) => {
  return new Promise(async resolve => {
    let razzle = razzleConfig || {};
    let razzleOptions = merge(defaultRazzleOptions, razzle.options || {});
    let paths = Object.assign({}, defaultPaths);
    // Check for razzle.config.js file
    if (fs.existsSync(paths.appRazzleConfig)) {
      try {
        razzle = require(paths.appRazzleConfig);
      } catch (e) {
        clearConsole();
        logger.error('Invalid razzle.config.js file.', e);
        process.exit(1);
      }
    }

    const plugins = Array.isArray(razzle.plugins)
      ? loadPlugins(razzle.plugins, paths)
      : [];

    for (const [plugin, pluginOptions] of plugins) {
      // Check if plugin.modifyOptions is a function.
      // If it is, call it on the configs we created.
      if (plugin.modifyOptions) {
        paths = await plugin.modifyOptions({
          options: {
            razzleOptions,
            pluginOptions,
          },
          paths,
        });
      }
    }
    if (razzle.modifyOptions) {
      // Check if razzle.modifyOptions is a function.
      // If it is, call it on the configs we created.
      razzleOptions = await razzle.modifyOptions({
        options: {
          razzleOptions,
        },
        paths,
      });
    }
    for (const [plugin, pluginOptions] of plugins) {
      // Check if plugin.modifyPaths is a function.
      // If it is, call it on the paths we created.
      if (plugin.modifyPaths) {
        paths = await plugin.modifyPaths({
          options: {
            razzleOptions,
            pluginOptions,
          },
          paths,
        });
      }
    }
    if (razzle.modifyPaths) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      paths = await razzle.modifyPaths({
        options: {
          razzleOptions,
        },
        paths,
      });
    }

    setupEnvironment(paths);

    resolve({ razzle, razzleOptions, webpackObject, plugins, paths });
  });
};
