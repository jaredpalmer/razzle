const fs = require('fs-extra');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

const defaultPaths = require('./paths');
const setupEnvironment = require('./env').setupEnvironment;
const loadPlugins = require('./loadPlugins');

module.exports = (webpackObject) => {
  return new Promise(resolve => {
    let razzle = {};
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
      ? loadPlugins(razzle.plugins)
      : [];

    setupEnvironment(paths);

    resolve({ razzle, webpackObject, plugins, paths });
  });
};
