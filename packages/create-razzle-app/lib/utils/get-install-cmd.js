'use strict';

const execa = require('execa');

const valid = ['npm', 'yarn'];
const defaultPackageManager = 'yarn';

let cmd;

// Default to yarn unless otherwise specified.
module.exports = function getInstallCmd(
  packageManager = defaultPackageManager
) {
  if (cmd) {
    return cmd;
  }
  if (valid.indexOf(packageManager) < 0) {
    console.log(
      `Invalid package manager param supplied, defaulting to trying ${defaultPackageManager}`
    );
    packageManager = defaultPackageManager;
  }

  try {
    execa.sync(packageManager, '--version');
    cmd = packageManager;
  } catch (e) {
    cmd = 'npm';
  }

  return cmd;
};
