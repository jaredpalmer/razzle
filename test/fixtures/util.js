'use strict';

const shell = require('shelljs');
const path = require('path');
const glob = require('glob');

const rootDir = path.join(path.resolve(__dirname), '..', '..');

const fs = require('fs-extra');

const silent = true;

const getWorkspaceDirs = (absolute = false) => {
  const rootJson = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json')));
  const workspaceDirs = rootJson.workspaces.map(item =>
    glob.sync(item, {cwd: rootDir, absolute: absolute})
  ).flat();
  return workspaceDirs;
};

const getWorkspacePackages = () => {
  const packages = getWorkspaceDirs(true)
    .map(item => JSON.parse(fs.readFileSync(path.join(item, 'package.json'))).name);
  return packages;
};

const removeWorkspacePackages = (fromPath) => {
  const stagePath = fromPath || process.cwd();
  const workspacePackages = getWorkspacePackages();
  const packageJson = path.join(stagePath, 'package.json');

  if (fs.existsSync(packageJson)) {
    const packageJsonData = JSON.parse(fs.readFileSync(packageJson));

    const newPackageJsonData = ["dependencies", "devDependencies"].reduce((acc, depType) => {
      if (acc[depType]) {
        acc[depType] = Object.keys(acc[depType]).reduce((depsAcc, dep) => {
          if (workspacePackages.includes(dep)) {
            delete depsAcc[dep];
          }
          return depsAcc;
        }, acc[depType]);
      }
      return acc;
    }, packageJsonData);

    return fs.writeFileSync(packageJson, JSON.stringify(newPackageJsonData, null, '  '));
  }
};

const copyExample = (exampleName, stageName) => {
  const stagePath = path.join(process.cwd(), stageName);
  fs.copySync(path.join(rootDir, 'examples', exampleName), stagePath);
  return stagePath;
};

const yalcPublishAll = () => {
  return getWorkspaceDirs().map(dir=>shell.exec(`yalc publish ${dir}`))
};

const yalcAddAll = () => {
  return getWorkspacePackages().map(pkg=>shell.exec(`yalc add ${pkg}`))
};

module.exports = {

  getWorkspaceDirs: getWorkspaceDirs,

  getWorkspacePackages: getWorkspacePackages,

  removeWorkspacePackages: removeWorkspacePackages,

  yalcPublishAll: yalcPublishAll,

  yalcAddAll: yalcAddAll,

  yalcSetupStageWithExample: (
    stageName,
    exampleName
  ) => {

    let silentState = shell.config.silent; // save old silent state
    let verboseState = shell.config.verbose; // save old silent state

    shell.config.verbose = !silent;
    shell.config.silent = silent;

    const stagePath = copyExample(exampleName, stageName);
    removeWorkspacePackages(stagePath);

    shell.cd(stagePath);

    shell.exec("yarn install", { env: Object.assign(process.env, {NODE_ENV:"development"}) });

    yalcAddAll();

    shell.config.verbose = verboseState;
    shell.config.silent = silentState;

    return stagePath;
  },

  copyExample: copyExample,

  setupStage: (stageName) => {
    const stagePath = path.join(rootDir, stageName);
    fs.ensureDirSync(stagePath);
    shell.cd(stagePath);
  },

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
    const packagesPath = path.join(rootDir, 'packages');

    let silentState = shell.config.silent; // save old silent state
    let verboseState = shell.config.verbose; // save old silent state

    shell.config.verbose = !silent;
    shell.config.silent = silent;

    const stagePath = copyExample(exampleName, stageName);

    shell.cd(stagePath);
    if (install) {
      shell.exec("yarn install", { env: Object.assign(process.env, {NODE_ENV:"development"}) });
    }
    if (symlink) {
      fs.ensureSymlinkSync(
        path.join(rootDir, 'node_modules'),
        path.join(stagePath, 'node_modules')
      );
      fs.ensureSymlinkSync(
        path.join(rootDir, 'node_modules', '.bin'),
        path.join(stagePath, 'node_modules', '.bin')
      );
      fs.ensureSymlinkSync(
        packagesPath,
        path.join(stagePath, 'packages')
      );
    }
    if (yarnlink) {
      const dirs = fs.readdirSync(packagesPath, { withFileTypes:true })
        .filter(dirent=>dirent.isDirectory()).map(dir=>dir.name);
      for (const packageName of dirs) {
        const packagePath = path.join(packagesPath, packageName);
        shell.cd(packagePath);
        shell.exec(`yarn link`);
        shell.cd(stagePath);
        shell.exec(`yarn link ${packageName}`);
        if (!silent) console.log(`Linked ${packageName} to ${stagePath}`);
      }
    }
    if (test) {
      shell.exec("yarn run test", { env: Object.assign(process.env, {CI:"true"}) });
    }

    shell.config.verbose = verboseState;
    shell.config.silent = silentState;

    return stagePath;
  },

  teardownStage: stageName => {
    shell.cd(rootDir);
    fs.removeSync(path.join(rootDir, stageName));
  },

  rootDir,
};
