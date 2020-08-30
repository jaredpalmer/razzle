const webpack = require('webpack');
const createConfig = require('./createConfigAsync');
const loadRazzleConfig = require('./loadRazzleConfig');

module.exports = (
  target,
  env,
  razzleConfig,
  clientOnly = false,
  packageJsonIn
) => {
  return new Promise(async resolve => {
    const {
      razzle,
      razzleOptions,
      webpackObject,
      plugins,
      paths,
    } = await loadRazzleConfig(webpack, razzleConfig, packageJsonIn);
    createConfig(
      target,
      env,
      razzle,
      webpackObject,
      clientOnly,
      paths,
      plugins,
      razzleOptions
    ).then(config => resolve(config));
  });
};
