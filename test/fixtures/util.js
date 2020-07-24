'use strict';

const shell = require('shelljs');
const path = require('path');
const rootDir = process.cwd();
const fs = require('fs-extra');


// shell.config.silent = true;

module.exports = {
  setupStageWithFixture: (stageName, fixtureName) => {
    const stagePath = path.join(rootDir, stageName);

    fs.copySync(path.join(rootDir, 'test', 'fixtures', fixtureName), stagePath);
    fs.ensureSymlinkSync(
      path.join(rootDir, 'node_modules'),
      path.join(stagePath, 'node_modules')
    );
    fs.ensureSymlinkSync(
      path.join(rootDir, 'packages'),
      path.join(stagePath, 'packages')
    );
    shell.cd(stagePath);
  },

  setupStageWithExample: (
    stageName,
    exampleName,
    symlink=true,
    yarnlink=false,
    install=false,
    test=false
  ) => {
    const stagePath = path.join(rootDir, stageName);
    const packagesPath = path.join(rootDir, 'packages');

    fs.copySync(path.join(rootDir, 'examples', exampleName), stagePath);
    if (symlink) {
      fs.ensureSymlinkSync(
        path.join(rootDir, 'node_modules'),
        path.join(stagePath, 'node_modules')
      );
      fs.ensureSymlinkSync(
        packagesPath,
        path.join(stagePath, 'packages')
      );
    }
    if (yarnlink) {
      fs.ensureSymlinkSync(
        path.join(rootDir, 'node_modules', '.bin'),
        path.join(stagePath, 'node_modules', '.bin')
      );
      const dirs = fs.readdirSync(packagesPath, { withFileTypes:true })
        .filter(dirent=>dirent.isDirectory()).map(dir=>dir.name);
      for (const packageName of dirs) {
        const packagePath = path.join(packagesPath, packageName);
        shell.cd(packagePath);
        shell.exec(`yarn link`);
        shell.cd(stagePath);
        shell.exec(`yarn link ${packageName}`);
        console.log(`Linked ${packageName} to ${stagePath}`);
      }
    }
    shell.cd(stagePath);
    if (install) {
      shell.exec("NODE_ENV=development yarn install");
    }
    if (test) {
      shell.exec("CI=true yarn run test");
    }
  },


  teardownStage: stageName => {
    shell.cd(rootDir);
    fs.removeSync(path.join(rootDir, stageName));
  },

  rootDir,
};
