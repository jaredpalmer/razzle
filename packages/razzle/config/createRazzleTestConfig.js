const webpack = require('webpack');
const createConfig = require('./createConfigAsync');
const loadRazzleConfig = require('./loadRazzleConfig');

module.exports = (target, env, razzleConfig, clientOnly = false) => {
  return new Promise(async (resolve) => {
    const { razzle, webpackObject, plugins, paths } = await loadRazzleConfig(webpack, razzleConfig);
    createConfig(
      target,
      env,
      razzle,
      webpackObject,
      clientOnly,
      paths,
      plugins
    ).then(config=>resolve(config));
  });
};
