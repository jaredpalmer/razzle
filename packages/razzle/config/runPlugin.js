'use strict';

function runPlugin(plugin, modifyObject, { target, dev }, webpack, paths, configOptions, func) {

  if (typeof plugin === 'function' && func === 'modifyConfig' || !func) {
    return plugin(modifyObject, { target, dev }, webpack);
  }

  if (typeof plugin.func === 'function' && func === 'modifyConfig' || !func) {
    // Used for writing plugin tests
    return plugin.func(modifyObject, { target, dev }, webpack, plugin.options);
  }

  if (plugin[func]) {
    return plugin[func](modifyObject, { target, dev }, webpack, plugin.options);
  } else {
    return modifyObject;
  }

}

module.exports = runPlugin;
