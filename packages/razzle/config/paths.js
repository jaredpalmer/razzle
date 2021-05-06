'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(path.join(process.cwd(), process.env.RAZZLE_APP_PATH || ''));
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const getPublicUrl = appPackageJson => {
  if (envPublicUrl) {
    return envPublicUrl;
  }
  
  if (fs.existsSync(appPackageJson)) {
    try {
      const packageJson = require(appPackageJson)
      return packageJson.homepage;
    } catch (e) {
      clearConsole();
      logger.error('Invalid package.json.', e);
      process.exit(1);
    }
  }

  return undefined;
};

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}

const resolveOwn = relativePath => path.resolve(__dirname, '..', relativePath);

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.
// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders
// Note that unlike in Node, only *relative* paths from `NODE_PATH` are honored.
// Otherwise, we risk importing Node.js core modules into an app instead of Webpack shims.
// https://github.com/facebookincubator/create-react-app/issues/1023#issuecomment-265344421
// We also resolve them to make sure all tools using them work consistently.
const nodePaths = (process.env.NODE_PATH || '')
  .split(path.delimiter)
  .filter(folder => folder && !path.isAbsolute(folder))
  .map(folder => path.resolve(appDirectory, folder))
  .join(path.delimiter);

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appBuild: resolveApp('build'),
  appBuildPublic: resolveApp('build/public'),
  appAssetsManifest: resolveApp('build/assets.json'),
  appBuildStaticExport: resolveApp('build/static_export.js'),
  appBuildStaticExportRoutes: resolveApp('build/public/static_routes.js'),
  appPublic: resolveApp('public'),
  appNodeModules: resolveApp('node_modules'),
  appSrc: resolveApp('src'),
  appHtml: resolveApp('public/index.html'), // client only
  appPackageJson: resolveApp('package.json'),
  appServerJs: resolveApp('src/server'),
  appServerIndexJs: resolveApp('src'),
  appClientIndexJs: resolveApp('src/client'),
  appStaticExportJs: resolveApp('src/static_export'),
  tsTestsSetup: resolveApp('src/setupTests.ts'),
  jsTestsSetup: resolveApp('src/setupTests.js'),
  appBabelRc: resolveApp('.babelrc'),
  appRazzleConfig: resolveApp('razzle.config.js'),
  nodePaths: nodePaths,
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  appJsConfig: resolveApp('jsconfig.json'),
  appTsConfig: resolveApp('tsconfig.json'),
};
