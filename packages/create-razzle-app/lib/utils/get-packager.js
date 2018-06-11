'use strict';

const execa = require('execa');
const isEnvLocal = require('./env');

let packager;

module.exports = function getPackager() {
  if (packager) {
    return packager;
  }

  // Locally, `yarn` would conflict with Yarn Workspaces.
  if (isEnvLocal) {
    packager = 'npm';
    return packager;
  }

  try {
    execa.sync('yarnpkg', '--version');
    packager = 'yarn';
  } catch (e) {
    packager = 'npm';
  }

  return packager;
};
