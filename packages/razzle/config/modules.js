'use strict';

const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const logger = require('razzle-dev-utils/logger');

function getAdditionalModulePaths(options = {}, paths) {
  const baseUrl = options.baseUrl;

  // We need to explicitly check for null and undefined (and not a falsy value) because
  // TypeScript treats an empty string as `.`.
  if (baseUrl == null) {
    // If there's no baseUrl set we respect NODE_PATH
    return paths.nodePaths.split(path.delimiter).filter(Boolean);
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  // We don't need to do anything if `baseUrl` is set to `node_modules`. This is
  // the default behavior.
  if (path.relative(paths.appNodeModules, baseUrlResolved) === '') {
    return null;
  }

  // Allow the user set the `baseUrl` to `appSrc`.-
  if (path.relative(paths.appSrc, baseUrlResolved) === '') {
    return [paths.appSrc];
  }

  // Otherwise, throw an error.
  throw new Error(
    logger.error(
      "Your project's `baseUrl` can only be set to `src` or `node_modules`." +
        ' Razzle does not support other values at this time.'
    )
  );
}

function getAdditionalAliases(options = {}, paths) {
  const baseUrl = options.baseUrl;
  let aliases = {};

  // We need to explicitly check for null and undefined (and not a falsy value) because
  // TypeScript treats an empty string as `.`.
  if (baseUrl == null) {
    // If there's no baseUrl we have no aliases
    return {};
  }

  const baseUrlResolved = path.resolve(paths.appPath, baseUrl);

  Object.keys(options.paths || {}).forEach(item => {
    const name = item.replace(/\/\*$/, '');
    // webpack5 allows arrays here, fix later
    const value = path.resolve(
      baseUrlResolved,
      options.paths[item][0].replace(/\/\*$/, '')
    );
    aliases[name] = value;
  });

  return aliases;
}

function getAdditionalIncludes(additionalAliases) {
  return Object.values(additionalAliases);
}

function getModules(paths) {
  // Check if TypeScript is setup
  const hasTsConfig = fs.existsSync(paths.appTsConfig);
  const hasJsConfig = fs.existsSync(paths.appJsConfig);

  if (hasTsConfig && hasJsConfig) {
    throw new Error(
      'You have both a tsconfig.json and a jsconfig.json. If you are using TypeScript please remove your jsconfig.json file.'
    );
  }

  let config;

  // If there's a tsconfig.json we assume it's a
  // TypeScript project and set up the config
  // based on tsconfig.json
  if (hasTsConfig) {
    const ts = require(resolve.sync('typescript', {
      basedir: paths.appNodeModules,
    }));
    config = ts.readConfigFile(paths.appTsConfig, ts.sys.readFile).config;
    // Otherwise we'll check if there is jsconfig.json
    // for non TS projects.
  } else if (hasJsConfig) {
    config = require(paths.appJsConfig);
  }

  config = config || {};
  const options = config.compilerOptions || {};

  const additionalModulePaths = getAdditionalModulePaths(options, paths);
  const additionalAliases = getAdditionalAliases(options, paths);
  const additionalIncludes = getAdditionalIncludes(additionalAliases);

  return {
    additionalModulePaths: additionalModulePaths,
    additionalAliases: additionalAliases,
    additionalIncludes: additionalIncludes,
  };
}

module.exports = getModules;
