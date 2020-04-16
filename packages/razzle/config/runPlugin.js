'use strict';

function runPlugin(plugin, config, { target, dev }, webpack, options) {
  if (typeof plugin === 'function') {
    return plugin(config, { target, dev }, webpack, options);
  }

  if (typeof plugin.func === 'function') {
    // Used for writing plugin tests
    return plugin.func(config, { target, dev }, webpack, plugin.options);
  }

  return config;
}

module.exports = runPlugin;
