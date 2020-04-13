const fs = require('fs-extra');
const logger = require('razzle-dev-utils/logger');

module.exports = (webpackObject, defaultPaths) => {
  return new Promise(async resolve => {
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

    // Apply modifyPaths razzle plugins
    for (const plugin of plugins) {
      paths = await Promise.resolve(
        runPlugin(plugin, paths, {}, {}, {}, 'modifyPaths')
      );
    }

    // Check if razzle.config has a modifyPaths function. If it does, call it on the
    // paths we created.
    paths = razzle.modifyPaths
      ? await Promise.resolve(razzle.modifyPaths(paths))
      : paths;

    resolve({ razzle, webpackObject, plugins, paths });
  });
};
