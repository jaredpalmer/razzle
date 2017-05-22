/* eslint-disable import/no-dynamic-require,global-require, no-console */
const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawnSync;

const type = process.env.type || 'upgrade'; // yarn update types
const logTask = msg => console.log(`👍  ${msg}`);

const installPackage = at => {
  const result = spawn('yarn', [type], { stdio: 'inherit', cwd: at });
  if (result.error) {
    console.log(result.error);
    process.exit(1);
  }
  logTask(`installed ${at}\n`);
};

const packages = fs.readdirSync('packages').reduce((pkgs, pkg) => {
  let packagePath = path.join(process.cwd(), 'packages', pkg);
  const packageJSON = path.join(packagePath, 'package.json');
  try {
    if (
      fs.statSync(packagePath).isDirectory() &&
      fs.statSync(packageJSON).isFile()
    ) {
      const packageName = require(packageJSON).name;
      pkgs.push({ path: packagePath, name: packageName });
    }
  } catch (e) {
    return pkgs;
  }
  return pkgs;
}, []);

console.log('\n🔥  Bootstrapping\n');

// Install the root package.json first so that we can use shelljs/semver.
installPackage(process.cwd());
const shell = require('shelljs');
const semver = require('semver');

// Make sure that we're all using the same version of yarn.
const yarnVersionRequirement = '>=0.20.0';
const yarnVersion = shell.exec('yarn --version').stdout;
if (!semver.satisfies(yarnVersion, yarnVersionRequirement)) {
  console.log(
    '❌  update your version of yarn:',
    `npm i yarn@${yarnVersionRequirement} -g`
  );
  process.exit(1);
}

// Install all of the monorepo packages.
packages.forEach(pkg => installPackage(pkg.path));

// Symlink monorepo package dependencies to local packages.
packages.forEach(pkg => {
  const packageJSON = require(path.join(pkg.path, 'package.json'));
  const dependencies = Object.assign(
    {},
    packageJSON.dependencies,
    packageJSON.devDependencies
  );
  packages.forEach(spkg => {
    if (dependencies.hasOwnProperty(spkg.name)) {
      // eslint-disable-line no-prototype-builtins
      const to = path.join(pkg.path, 'node_modules', spkg.name);
      shell.rm('-rf', to);
      shell.ln('-sf', spkg.path, to);
      logTask(`symlinked:\n${to} -> ${spkg.path}\n`);
    }
  });
});

// npm link packages
shell.exec('npm link', {
  cwd: path.join(process.cwd(), 'packages', 'razzle'),
});
logTask('razzle\n');
shell.exec('npm link', {
  cwd: path.join(process.cwd(), 'packages', 'babel-preset-razzle'),
});
logTask('babel-preset-razzle');
shell.exec('npm link', {
  cwd: path.join(process.cwd(), 'packages', 'create-razzle-app'),
});
logTask('create-razzle-app');

console.log('\n✅  strapped\n');
