const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const util = require('util');
const glob = util.promisify(require('glob'));

const rootDir = process.cwd();

let argv = yargs
  .usage('$0 [-p|--preid] [-s|--semver-keyword] [-t|--tag] [-c|--commit]')
  .command({
    command: '*',
    builder: yargs => {
      return yargs
        .option('p', {
          alias: 'preid',
          describe: 'the npm release id',
          default: 'latest',
          type: 'string',
        })
        .option('s', {
          alias: 'semver-keyword',
          describe: 'the semver keyword',
          default: 'patch',
          type: 'string',
        })
        .option('t', {
          alias: 'tag',
          describe: 'add git tag',
          type: 'boolean',
          default: false,
        })
        .option('c', {
          alias: 'commit',
          describe: 'add git commit',
          type: 'boolean',
          default: false,
        });
    },
    handler: async argv => {
      console.log(argv);

      const preId = argv.preId;
      const semverKeyword =
        preId !== 'latest'
          ? argv.semverKeyword == 'patch'
            ? 'prerelease'
            : argv.semverKeyword
          : argv.semverKeyword;

      let packageJsonData = JSON.parse(
        await fs.readFile(path.join(rootDir, 'package.json'))
      );

      if (preId !== 'latest') {
        packageJsonData.version = semver.inc(
          packageJsonData.version,
          semverKeyword,
          preId
        );
      } else {
        packageJsonData.version = semver.inc(
          packageJsonData.version,
          semverKeyword
        );
      }
      console.log(packageJsonData);

      const packageJsonGlobs = packageJsonData.workspaces.concat('examples/**');

      const packageJsons = (
        await Promise.all(
          packageJsonGlobs.map(item => glob(item + '/package.json'))
        )
      ).flat();

      console.log(packageJsons);

      const packageVersions = (
        await Promise.all(
          packageJsons.map(async item => JSON.parse(await fs.readFile(item)))
        )
      ).map(item => [item.name, item.version, packageJsonData.version]);

      const packageNames = packageVersions.map(item => item[0]);

      console.log(
        Object.fromEntries(packageVersions.map(item => [item[0], item[2]]))
      );

      packageJsons.map(async item => {
        let json = JSON.parse(await fs.readFile(item));
        json.version = packageJsonData.version;
        let newJson = [
          'dependencies',
          'devDependencies',
          'peerDependencies',
        ].reduce((acc, depType) => {
          if (acc[depType]) {
            acc[depType] = Object.keys(acc[depType]).reduce((depsAcc, dep) => {
              if (packageNames.includes(dep)) {
                depsAcc[dep] = packageJsonData.version;
              }

              return depsAcc;
            }, acc[depType]);
          }
          return acc;
        }, json);
        console.log(newJson);
        return fs.writeFile(item, JSON.stringify(json, null, '  '));
      });

      if (argv.commit) {
        await execa(`git commit -m "bumped versions to ${packageJsonData.version}"`, {shell: true, stdio: 'inherit' });
      }
      if (argv.commit && argv.tag) {
        await execa(`git tag -am "v${packageJsonData.version}" v${packageJsonData.version}`, {shell: true, stdio: 'inherit' });
      }
      //     await execa(`git tag -d ${latestTag}`, {shell: true, stdio: 'inherit' });

      // const lernaCmd = releaseTag == 'latest' ?
      //   `lerna version ${semverKeyword} --force-publish --no-push --no-commit-hooks` :
      //   `lerna version ${semverKeyword} --preid ${releaseTag} --force-publish --no-push --no-commit-hooks`;
      // execa(lernaCmd, {shell: true, stdio: 'inherit' }).then(async ({exitCode})=>{
      //     const latestTagId = (await execa('git rev-list --tags --max-count=1', {shell: true})).stdout;
      //     const latestTag = (await execa(`git describe --tags ${latestTagId}`, {shell: true})).stdout;
      //     console.log(`deleting tag ${latestTag}`);
      //     await execa(`git tag -d ${latestTag}`, {shell: true, stdio: 'inherit' });
      //     console.log(`soft resetting head one rev`);
      //     await execa(`git reset --soft HEAD~1`, {shell: true, stdio: 'inherit' });
      //     console.log(`running pre-publish-all`);
      //     await execa(`yarn pre-publish-all`, {shell: true, stdio: 'inherit' });
      //     console.log(`comitting pre-publish-all changes`);
      //     await execa(`git commit -am "published ${latestTag}"`, {shell: true, stdio: 'inherit' });
      //     console.log(`retagging release`);
      //     await execa(`git tag -am "${latestTag}" ${latestTag}`, {shell: true, stdio: 'inherit' });
      //     console.log(`pushing to origin`);
      //     await execa(`git push origin`, {shell: true, stdio: 'inherit' });
      //     console.log(`pushing tags to origin`);
      //     await execa(`git push --tags origin`, {shell: true, stdio: 'inherit' });
      //     console.log(`done`);
      // });
    },
  })
  .help().argv;
