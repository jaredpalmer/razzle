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

  // Support for not released plugins without options
  // Use plugin.object if you need options
  if (typeof plugin === 'object' && !plugin.name && !plugin.object) {
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

  const completePluginNames = [
    `razzle-plugin-${plugin.name}`,
    `${plugin.name}/razzle-plugin`,
    plugin.name.includes('/') && plugin.name
  ].filter(Boolean);

  // Try to find the plugin in node_modules
  let razzlePlugin = null;
  for (const completePluginName of completePluginNames) {
    razzlePlugin = require(completePluginName);
    if (razzlePlugin) {
      break;
    }
  }

  if (!razzlePlugin) {
    throw new Error(`Unable to find '${completePluginName[0]}' or '${completePluginName[1]}'`);
  }

  return [razzlePlugin, plugin.options];
}

function loadPlugins(plugins, paths) {
  return plugins.map(function(plugin) {
    return loadPlugin(plugin, paths);
  });
}

module.exports = loadPlugins;
