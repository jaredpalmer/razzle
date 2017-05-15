'use strict';

const paths = require('./paths');

// Grab NODE_ENV and RAZZLE_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const RAZZLE = /^RAZZLE_/i;

function getClientEnvironment(target, options) {
  const raw = Object.keys(process.env).filter(key => RAZZLE.test(key)).reduce((
    env,
    key
  ) => {
    env[key] = process.env[key];
    return env;
  }, {
    // Useful for determining whether we’re running in production mode.
    // Most importantly, it switches React into the correct mode.
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || options.port || 3000,
    VERBOSE: !!process.env.VERBOSE,
    HOST: process.env.HOST || options.host || 'localhost',
    RAZZLE_ASSETS_MANIFEST: paths.appManifest,
    BUILD_TARGET: target === 'web' ? 'client' : 'server',
    // The public dir changes between dev and prod, so we use an environment
    // variable available to users.
    RAZZLE_PUBLIC_DIR: process.env.NODE_ENV === 'production'
      ? paths.appBuildPublic
      : paths.appPublic,
  });
  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = getClientEnvironment;
