const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');

const util = require('util');
const glob = util.promisify(require('glob'));

const rootDir = process.cwd();

let argv = yargs
  .usage(
    '$0 [-p|--preid] [-s|--semver-keyword] [-t|--tag] [-c|--commit] [-u|--untag] '
  )
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
        .option('u', {
          alias: 'untag',
          describe: 'untag current version',
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
        fs.readFileSync(path.join(rootDir, 'package.json'))
      );

      const unTagCmd = `git tag -d v${packageJsonData.version}`;
      const unTagRemoteCmd = `git push origin :refs/tags/v${packageJsonData.version}`;

      if (!argv.untag) {
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

        const commitCmd = `git commit -a -m "chore: bumped versions to ${packageJsonData.version}"`;
        const tagCmd = `git tag -am "v${packageJsonData.version}" v${packageJsonData.version}`;
        const tagRemoteCmd = `git push origin refs/tags/v${packageJsonData.version}`;

        console.log(packageJsonData);

        const packageJsonGlobs = packageJsonData.workspaces.concat(
          'examples/**'
        );

        const packageJsons = (
          await Promise.all(
            packageJsonGlobs.map(item => glob(item + '/package.json'))
          )
        )
          .flat()
          .concat(['lerna.json', 'package.json']);

        console.log(packageJsons);

        const packageVersions = packageJsons
          .map(item => {
            try {
              return JSON.parse(fs.readFileSync(item));
            } catch {
              console.log(`failed to parse json ${item}`);
            }
          })
          .map(item => [
            item.name || 'it-is-lerna',
            item.version,
            packageJsonData.version,
          ]);

        const packageNames = packageVersions.map(item => item[0]);

        console.log(
          Object.fromEntries(packageVersions.map(item => [item[0], item[2]]))
        );

        packageJsons.map(item => {
          let json = JSON.parse(fs.readFileSync(item));
          json.version = packageJsonData.version;
          let newJson = [
            'dependencies',
            'devDependencies',
            'peerDependencies',
          ].reduce((acc, depType) => {
            if (acc[depType]) {
              acc[depType] = Object.keys(acc[depType]).reduce(
                (depsAcc, dep) => {
                  if (packageNames.includes(dep)) {
                    depsAcc[dep] = packageJsonData.version;
                  }

                  return depsAcc;
                },
                acc[depType]
              );
            }
            return acc;
          }, json);
          console.log(newJson);
          const jsonString = JSON.stringify(json, null, '  ') + '\n';
          if (jsonString) {
            try {
              return fs.writeFileSync(item, jsonString);
            } catch {
              console.log(`failed to write json ${item}`);
            }
          } else {
            console.log(`not writing empty json ${item}`);
          }
        });

        if (argv.commit) {
          console.log(`Running: ${commitCmd}`);
          await execa(commitCmd, { shell: true, stdio: 'inherit' });
        } else {
          console.log(`Not running: ${commitCmd}`);
          console.log(`Run ${commitCmd} to commit.`);
        }
        if (argv.commit && argv.tag) {
          console.log(`Running: ${tagCmd}`);
          console.log(`Run ${tagRemoteCmd} to tag in remote.`);
          await execa(tagCmd, { shell: true, stdio: 'inherit' });
        } else {
          console.log(`Not running: ${tagCmd}`);
          console.log(`Run ${tagCmd} to tag.`);
          console.log(`Run ${tagRemoteCmd} to tag in remote.`);
        }
        console.log('Check that everything is ok and push to origin');
      } else {
        console.log(`Running: ${unTagCmd}`);
        console.log(`Run ${unTagRemoteCmd} to untag in remote.`);
        await execa(unTagCmd, {
          shell: true,
          stdio: 'inherit',
        });
      }
    },
  })
  .help().argv;
