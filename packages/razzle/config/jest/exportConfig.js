'use strict';

const loadRazzleConfig = require("../loadRazzleConfig.js");
const webpack = require("webpack");
const defaultPaths = require("../paths");
const createJestConfig = require("../createJestConfig");
const path = require("path");

module.exports = async () => {
  const { razzle, razzleOptions, webpackObject, plugins, paths } = await loadRazzleConfig(webpack, defaultPaths);
  return await createJestConfig(
    relativePath => path.resolve(paths.ownPath, relativePath),
    path.resolve(paths.appSrc, ".."),
    razzle,
    razzleOptions,
    webpackObject,
    plugins,
    paths
  );
};
