'use strict';

function loadPlugin(plugin) {
  if (typeof plugin === 'string') {
    // Apply the plugin with default options if passing only a string
    return loadPlugin({ name: plugin });
  }

  if (typeof plugin === 'function') {
    return [plugin, {}];
  }

  if (typeof plugin.func === 'function') {
    // Used for writing plugin tests
    return [plugin.func, plugin.options];
  }
  
  const completePluginName = `razzle-plugin-${plugin.name}`;

  // Try to find the plugin in node_modules
  const razzlePlugin = require(completePluginName);
  if (!razzlePlugin) {
    throw new Error(`Unable to find '${completePluginName}`);
  }

  return [razzlePlugin, plugin.options];
}

function loadPlugins(plugins) {
  return plugins.map(loadPlugin);
}

module.exports = loadPlugins;
