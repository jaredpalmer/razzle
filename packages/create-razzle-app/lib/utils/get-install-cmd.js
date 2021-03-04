'use strict';

const execa = require('execa');

let cmd;

module.exports = function getInstallCmd(opts) {
  if (cmd) {
    return cmd;
  }

  let foundCmds = {};

  try {
    foundCmds.yarn = {
      version: execa.sync('yarnpkg', ['--version']).stdout,
      cmd: 'yarn'
    }
  } catch (e) {}

  try {
      foundCmds.npm = {
        version: execa.sync('npm', ['--version']).stdout,
        cmd: 'npm'
      }
  } catch (e) {}

  if (opts.npm) {
    cmd = foundCmds.npm;
    if (!cmd) {
      console.error("No npm found");
      process.exit(1);
    }
  } else if (opts.yarn) {
    cmd = foundCmds.yarn;
    if (!cmd) {
      console.error("No yarn found");
      process.exit(1);
    }
  } else{
    cmd = foundCmds.yarn || foundCmds.npm;
    if (!cmd) {
      console.error("No package manager found");
      process.exit(1);
    }
  }


  return cmd;
};
