'use strict';

const execa = require('execa');
const Promise = require('promise');
const messages = require('../messages');
const getPackager = require('./get-packager');
const output = require('./output');
const isEnvLocal = require('./env');

module.exports = function install(opts) {
  const projectName = opts.projectName;
  const projectPath = opts.projectPath;
  const packages = opts.packages || [];

  if (packages.length === 0) {
    console.log('Missing packages in `install`, try running again.');
    process.exit(1);
  }

  const packager = getPackager();
  const installArgs = getInstallArgs(packager, packages);

  console.log(messages.installing(packages));
  process.chdir(projectPath);

  return new Promise((resolve, reject) => {
    // `pkg.scripts.init:bin`
    // Some packages may require compilers. Some, like BuckleScript's, are
    // compiled locally. When added directly to `devDependencies`, internal
    // `yarn install` performs an unnecessary, expensive operation. Therefore,
    // `npm/yarn run init` bootstraps these requirements in userland.
    let stopSpinner = output.wait('Installing requirements (e.g., a compiler)');
    let withInit = false;
    const initArgs = ['run', 'init:bin'];

    execa(packager, initArgs)
      .then(() => {
        withInit = true;
        showInstallingModules();
        install();
      })
      .catch(install);

    function install() {
      !withInit && showInstallingModules();
      execa(packager, installArgs)
        .then(() => {
          // Confirm that all dependencies were installed
          return execa(packager, ['install']);
        })
        .then(() => {
          stopSpinner();
          withInit &&
            output.success(`Initialized requirements for ${projectName}`);
          output.success(`Installed dependencies for ${projectName}`);
          resolve(withInit);
        })
        .catch(() => {
          stopSpinner();
          console.log(messages.installError(packages));
          return reject(new Error(`${packager} installation failed`));
        });
    }

    function showInstallingModules() {
      stopSpinner();
      stopSpinner = output.wait('Installing modules');
    }
  });
};

function getInstallArgs(packager, packages) {
  if (packager === 'npm') {
    const args = ['install', '--save', '--save-exact'];
    return args.concat(packages, ['--verbose']);
  } else if (packager === 'yarn') {
    const args = ['add'];
    return args.concat(packages);
  }
}
