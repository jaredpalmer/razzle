'use strict';

const fs = require('fs-extra');
const path = require('path');

function setupEnvironment(paths) {
  const NODE_ENV = process.env.NODE_ENV;
  if (!NODE_ENV) {
    throw new Error(
      'The NODE_ENV environment variable is required but was not specified.'
    );
  }

  // https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
  var dotenvFiles = [
    `${paths.dotenv}.${NODE_ENV}.local`,
    `${paths.dotenv}.${NODE_ENV}`,
    `${paths.dotenv}.local`,
    paths.dotenv,
  ];
  // Load environment variables from .env* files. Suppress warnings using silent
  // if this file is missing. dotenv will never modify any environment variables
  // that have already been set. Variable expansion is supported in .env files.
  // https://github.com/motdotla/dotenv
  // https://github.com/motdotla/dotenv-expand
  dotenvFiles.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      );
    }
  });
}
// Grab NODE_ENV and RAZZLE_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const RAZZLE = /^RAZZLE_/i;

function getClientEnvironment(target, options, paths) {
  const raw = Object.keys(process.env)
    .filter(key => RAZZLE.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        // Useful for determining whether we’re running in production mode.
        // Most importantly, it switches React into the correct mode.
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || options.port || 3000,
        VERBOSE: !!process.env.VERBOSE,
        HOST: process.env.HOST || options.host || 'localhost',
        RAZZLE_ASSETS_MANIFEST: paths.appAssetsManifest,
        RAZZLE_CHUNKS_MANIFEST: paths.appChunksManifest,
        BUILD_TARGET: target === 'web' ? 'client' : 'server',
        // only for production builds. Useful if you need to serve from a CDN
        PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
        // CLIENT_PUBLIC_PATH is a PUBLIC_PATH for NODE_ENV === 'development' && BUILD_TARGET === 'client'
        // It's useful if you're running razzle in a non-localhost container. Ends in a /
        CLIENT_PUBLIC_PATH: process.env.CLIENT_PUBLIC_PATH,
        // The public dir changes between dev and prod, so we use an environment
        // variable available to users.
        RAZZLE_PUBLIC_DIR:
          process.env.NODE_ENV === 'production'
            ? paths.appBuildPublic
            : paths.appPublic,
        // Whether or not react-refresh is enabled.
        // react-refresh is not 100% stable at this time,
        // which is why it's disabled by default.
        // It is defined here so it is available in the webpackHotDevClient.
        FAST_REFRESH: options.shouldUseReactRefresh,
      }
    );
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = Object.keys(raw).reduce((env, key) => {
    env[`process.env.${key}`] = JSON.stringify(raw[key]);
    return env;
  }, {});

  return { raw, stringified };
}

module.exports = {
  getClientEnv: getClientEnvironment,
  setupEnvironment: setupEnvironment,
};
