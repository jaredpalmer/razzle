'use strict';

function runPlugin(
  plugin,
  modifyObject,
  env,
  webpack,
  paths,
  configOptions,
  func
) {
  if ((typeof plugin === 'function' && func === 'modifyConfig') || !func) {
    return plugin(modifyObject, env, webpack);
  }

  if ((typeof plugin.func === 'function' && func === 'modifyConfig') || !func) {
    // Used for writing plugin tests
    return plugin.func(modifyObject, env, webpack, plugin.options);
  }

  if (plugin[func]) {
    return plugin[func](
      modifyObject,
      env,
      webpack,
      plugin.options,
      paths,
      configOptions
    );
  } else {
    return modifyObject;
  }
}

module.exports = runPlugin;
