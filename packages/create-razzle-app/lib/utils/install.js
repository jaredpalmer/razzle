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

  if (packages.length === 0) {
    console.log('Missing packages in `install`, try running again.');
    process.exit(1);
  }

  const installCmd = getInstallCmd();
  const installArgs = getInstallArgs(installCmd, packages);

  console.log(messages.installing(packages));
  process.chdir(projectPath);

  return new Promise(function(resolve, reject) {
    const stopInstallSpinner = output.wait('Installing modules');
    execa(installCmd.cmd, installArgs, { cwd: projectPath, stdio: 'inherit' })
      .then(function() {
        // Confirm that all dependencies were installed
        // ignore-engines for node 9.x

        return execa(
          installCmd.cmd,
          ['install'].filter(
            x => x
          ), { cwd: projectPath, stdio: 'inherit'  }
        );
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

function getInstallArgs(cmd, packages) {
  if (cmd.cmd === 'npm') {
    const args = ['install', '--save', '--save-exact'];
    return args.concat(packages, ['--verbose']);
  } else if (cmd.cmd === 'yarn') {
    const args = ['add'];
    return args.concat(packages,
      parseInt(cmd.version[0]) !== 2 ? ['--ignore-engines'] : []);
  }
}
