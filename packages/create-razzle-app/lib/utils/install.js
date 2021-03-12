'use strict';

const execa = require('execa');
const Promise = require('promise');
const messages = require('../messages');
const getInstallCmd = require('./get-install-cmd');
const output = require('./output');

module.exports = function install(opts) {
  const projectName = opts.projectName;
  const projectPath = opts.projectPath;
  const packages = opts.packages || [];
  const devPackages = opts.devPackages || [];

  // if (packages.length === 0) {
  //   console.log('Missing packages in `install`, try running again.');
  //   process.exit(1);
  // }

  const installCmd = getInstallCmd(opts);
  const addDevArgs = getAddArgs(installCmd, devPackages, opts, true);
  const addArgs = getAddArgs(installCmd, packages, opts, false);
  const installArgs = getInstallArgs(installCmd, packages, opts);

  console.log(messages.installing(packages));
  process.chdir(projectPath);

  const stdio = opts.verbose ? 'inherit' : 'pipe';

  return new Promise(function(resolve, reject) {
    const stopInstallSpinner = output.wait('Installing modules');
    execa(installCmd.cmd, addDevArgs, { cwd: projectPath, stdio: stdio })
      .then(function() {

        return (packages.length === 0 ? Promise.resolve() : execa(
          installCmd.cmd,
          addArgs, { cwd: projectPath, stdio: stdio }
        )).then(function() {
          // Confirm that all dependencies were installed
          // ignore-engines for node 13.x

          return execa(
            installCmd.cmd,
            installArgs, { cwd: projectPath, stdio: stdio }
          );
        })
      })
      .then(function() {
        stopInstallSpinner();
        output.success(`Installed dependencies for ${projectName}`);
        resolve();
      })
      .catch(function(res) {
        stopInstallSpinner();
        console.log(messages.installError(packages));
        return reject(new Error(`${installCmd.cmd} installation failed`));
      });
  });
};

function getInstallArgs(cmd, packages, opts) {
  if (cmd.cmd === 'npm') {
    const args = ['install'];
    return args.concat(packages, ['--verbose']);
  } else if (cmd.cmd === 'yarn') {
    const args = ['install'];
    return args.concat(
      parseInt(cmd.version[0]) !== 2 ? ['--ignore-engines'] : []);
  }
}

function getAddArgs(cmd, packages, opts, dev) {
  if (cmd.cmd === 'npm') {
    const args = ['install', dev ? '--save-dev' : '--save', '--save-exact'];
    return args.concat(packages, ['--verbose']);
  } else if (cmd.cmd === 'yarn') {
    const args = ['add', '-W', dev && '--dev'].filter(x=>x);
    return args.concat(packages,
      parseInt(cmd.version[0]) !== 2 ? ['--ignore-engines'] : []);
  }
}
