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
      if (acc.packageJsonData[depType]) {
        acc.packageJsonData[depType] = Object.keys(acc.packageJsonData[depType]).reduce((depsAcc, dep) => {
          if (workspacePackages.includes(dep)) {
            acc.removedPackages.push(dep);
            delete depsAcc[dep];
          }
          return depsAcc;
        }, acc.packageJsonData[depType]);
      }
      return acc;
    }, { packageJsonData: packageJsonData, removedPackages: []});

    fs.writeFileSync(packageJson, JSON.stringify(newPackageJsonData.packageJsonData, null, '  '));
    return newPackageJsonData.removedPackages;
  }
};

const resolutionsYalc = (fromPath) => {
  const stagePath = fromPath || process.cwd();
  const packageJson = path.join(stagePath, 'package.json');

  if (fs.existsSync(packageJson)) {
    const packageJsonData = JSON.parse(fs.readFileSync(packageJson));

    const newPackageJsonData = ["dependencies", "devDependencies"].reduce((acc, depType) => {
      acc.resolutions = acc.resolutions || {};
      if (acc[depType]) {
        Object.keys(acc[depType]).reduce((depsAcc, dep) => {
          if (acc[depType][dep].indexOf('.yalc') !== -1) {
            acc.resolutions[dep] = acc[depType][dep];
          }
          return depsAcc;
        }, acc[depType]);
      }
      return acc;
    }, packageJsonData);

    return fs.writeFileSync(packageJson, JSON.stringify(newPackageJsonData, null, '  '));
  }
};

const scriptsYalc = (fromPath) => {
  const stagePath = fromPath || process.cwd();
  const packageJson = path.join(stagePath, 'package.json');

  if (fs.existsSync(packageJson)) {
    const packageJsonData = JSON.parse(fs.readFileSync(packageJson));
    packageJsonData.scripts = packageJsonData.scripts || {};
    packageJsonData.scripts['updateyalc'] = `cd ${rootDir} && yarn yalc-publish-all`;
    return fs.writeFileSync(packageJson, JSON.stringify(packageJsonData, null, '  '));
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

const yalcPublishPushAll = () => {
  return getWorkspaceDirs().map(dir=>shell.exec(`yalc publish --push ${dir}`))
};

const yalcAddAll = (packages, cwd) => {
  if (packages) {
    console.log('Installing ' + packages + ' with yalc');
  }
  return (packages ? packages : getWorkspacePackages()).map(pkg=>shell.exec(`yalc add --no-pure ${pkg}`, { cwd: cwd ? cwd : process.cwd() }))
};

const setupStageWithExample = (
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
      .map(dir=>{ return dir.isDirectory ? dir.name: dir });
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
};

module.exports = {

  getWorkspaceDirs: getWorkspaceDirs,

  getWorkspacePackages: getWorkspacePackages,

  removeWorkspacePackages: removeWorkspacePackages,

  yalcPublishAll: yalcPublishAll,

  yalcPublishPushAll: yalcPublishPushAll,

  yalcAddAll: yalcAddAll,

  yalcSetupStageWithExample: (
    stageName,
    exampleName
  ) => {

    let silentState = shell.config.silent; // save old silent state
    let verboseState = shell.config.verbose; // save old silent state

    shell.config.verbose = true;
    shell.config.silent = false;

    yalcPublishAll();
    const stagePath = copyExample(exampleName, stageName);
    removeWorkspacePackages(stagePath);

    shell.cd(stagePath);

    yalcAddAll();

    resolutionsYalc(stagePath);

    scriptsYalc(stagePath);

    shell.exec("yarn install", { env: Object.assign(process.env, {NODE_ENV:"development"}) });

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

  setupStageWithExample: setupStageWithExample,

  teardownStage: stageName => {
    shell.cd(rootDir);
    fs.removeSync(path.join(rootDir, stageName));
  },

  rootDir,
};
