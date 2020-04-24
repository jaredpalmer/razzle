'use strict';

const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();

// shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(rootDir, stageName);
    shell.mkdir(stagePath);
    shell.exec(`cp -a ${rootDir}/test/fixtures/${fixtureName}/. ${stagePath}/`);
    shell.ln(
      '-s',
      path.join(rootDir, 'packages/razzle/node_modules'),
      path.join(stagePath, 'node_modules')
    );
    shell.cd(stagePath);
  },

  setupStageWithExample: (stageName, exampleName) => {
    const stagePath = path.join(rootDir, stageName);
    shell.mkdir(stagePath);
    shell.exec(`cp -a ${rootDir}/examples/${exampleName}/. ${stagePath}/`);
    shell.ln(
      '-s',
      path.join(rootDir, 'packages/razzle/node_modules'),
      path.join(stagePath, 'node_modules')
    );
    shell.cd(stagePath);
  },

  teardownStage: stageName => {
    shell.cd(rootDir);
    shell.rm('-rf', path.join(rootDir, stageName));
  },

  rootDir,
};
