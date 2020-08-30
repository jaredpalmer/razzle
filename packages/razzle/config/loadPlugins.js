'use strict';

const resolve = require('resolve');

function loadPlugin(plugin, paths) {
  if (typeof plugin === 'string') {
    // Apply the plugin with default options if passing only a string
    return loadPlugin({ name: plugin }, paths);
  }

  if (typeof plugin === 'function') {
    return [plugin, {}];
  }

  if (typeof plugin.func === 'function') {
    // Used for writing plugin tests
    return [plugin.func, plugin.options];
  }

  if (typeof plugin.object === 'object') {
    // Used for writing plugin tests
    return [plugin.object, plugin.options];
  }

  const completePluginName = `razzle-plugin-${plugin.name}`;

  // Try to find the plugin in node_modules
  const razzlePlugin = require(resolve.sync(completePluginName, {
    basedir: paths.appDir,
  }));
  if (!razzlePlugin) {
    throw new Error(`Unable to find '${completePluginName}`);
  }

  return [razzlePlugin, plugin.options];
}

function loadPlugins(plugins, paths) {
  return plugins.map(function(plugin) {
    return loadPlugin(plugin, paths);
  });
}

module.exports = loadPlugins;
