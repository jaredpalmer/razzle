'use strict';

const execa = require('execa');

let cmd;

module.exports = function getInstallCmd() {
  if (cmd) {
    return cmd;
  }

  try {
    cmd = {
      version: execa.sync('yarnpkg', ['--version']).stdout,
      cmd: 'yarn'
    }
  } catch (e) {
    cmd = {
      version: execa.sync('npm', ['--version']).stdout,
      cmd: 'npm'
    }
  }

  return cmd;
};
