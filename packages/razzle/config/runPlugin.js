'use strict';

function runPlugin(plugin, config, { target, dev }, webpack) {
  if (typeof plugin === 'string') {
    // Apply the plugin with default options if passing only a string
    return runPlugin({ name: plugin }, config, { target, dev }, webpack);
  }

  if (typeof plugin === 'function') {
    return plugin(config, { target, dev }, webpack);
  }

  if (typeof plugin.func === 'function') {
    // Used for writing plugin tests
    return plugin.func(config, { target, dev }, webpack, plugin.options);
  }

  const completePluginNames = [`razzle-plugin-${plugin.name}`, `${plugin.name}/razzle-plugin`];
  
  // Try to find the plugin in node_modules
  let razzlePlugin = null;
  for (const completePluginName of completePluginNames) {
    razzlePlugin = require(completePluginName);
  }  
  
  if (!razzlePlugin) {
    throw new Error(`Unable to find '${completePluginName[0]}' or '${completePluginName[1]}'`);
  }

  return razzlePlugin(config, { target, dev }, webpack, plugin.options);
}

module.exports = runPlugin;
