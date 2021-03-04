const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const semver = require('semver');
const inquirer = require('inquirer');
const util = require('util');
const glob = util.promisify(require('glob'));

const rootDir = process.cwd();

let argv = yargs
.usage(
  '$0 [-p|--preid] [-s|--semver-keyword] [-t|--tag] [-c|--commit] [-u|--untag] [--push] [--noninteractive]'
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
    })
    .option('pu', {
      alias: 'push',
      describe: 'push changes and tag',
      type: 'boolean',
      default: false,
    })
    .option('i', {
      alias: 'noninteractive',
      describe: `don't ask for confirmation`,
      type: 'boolean',
      default: false,
    });
  },
  handler: async argv => {

    const preId = argv.preid;
    const semverKeyword =
    preId !== 'latest'
    ? argv.semverKeyword == 'patch'
    ? 'prerelease'
    : argv.semverKeyword
    : argv.semverKeyword;

    let packageJsonData = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'package.json'))
    );

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

      if (!argv.noninteractive) {
        await inquirer.prompt([
          {
            type: 'confirm',
            name: 'publish',
            message: `Are you sure you want to release v${packageJsonData.version}?`,
          }
        ]).then((answers) => {
          if (answers.publish === false) {
            process.exit(1);
          }
        });


      }

      const examplesGlob = 'examples/*/';

      const examples = await glob(examplesGlob);

      const packageJsonGlobs = packageJsonData.workspaces.concat(
        'examples/*'
      );

      const packageJsons = (
        await Promise.all(
          packageJsonGlobs.map(item => glob(item + '/package.json'))
        )
      )
      .flat()
      .concat(['lerna.json', 'package.json', 'packages/create-razzle-app/templates/default/package.json']);

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
      const commitCmd = `git commit -a -m "chore: bumped versions to ${packageJsonData.version}"`;
      const tagCmd = `git tag -am "v${packageJsonData.version}" v${packageJsonData.version}`;
      const tagRemoteCmd = `git push origin refs/tags/v${packageJsonData.version}`;
      const unTagCmd = `git tag -d v${packageJsonData.version}`;
      const unTagRemoteCmd = `git push origin :refs/tags/v${packageJsonData.version}`;
      const pushCmd = `git push origin`;
      const pullCmd = `git pull origin`;

      const officialExamples = 'module.exports = '
      + JSON.stringify(
        examples.map(example=>path.basename(example)
      ), null, '  ') + ';\n';

      await fs.writeFile(
        'packages/create-razzle-app/lib/officialExamples.js',
        officialExamples);
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
          console.log(`\nRunning: '${commitCmd}'`);
          await execa(commitCmd, { shell: true, stdio: 'inherit' });
        } else {
          console.log(`\nNot running: '${commitCmd}'`);
          console.log(`Run '${commitCmd}' to commit.`);
        }
        if (argv.commit && argv.tag) {
          console.log(`\nRunning: '${tagCmd}'`);
          console.log(`Run '${unTagCmd}' to untag.`);
          await execa(tagCmd, { shell: true, stdio: 'inherit' });
          if (argv.push) {
            console.log(`\nRunning: '${pushCmd}'`);
            await execa(pushCmd, { shell: true, stdio: 'inherit' });
            console.log(`\nRunning: '${tagRemoteCmd}'`);
            await execa(tagRemoteCmd, { shell: true, stdio: 'inherit' });
            console.log(`Run '${unTagRemoteCmd}' to untag in remote.`);
            console.log(`\nRunning: '${pullCmd}'`);
            await execa(pullCmd, { shell: true, stdio: 'inherit' });
          } else {
            console.log(`\nNot running: '${pushCmd}'`);
            console.log(`Run '${pushCmd}' to push to origin.`);
            console.log(`\nNot running: '${tagRemoteCmd}'`);
            console.log(`Run '${tagRemoteCmd}' to tag in remote.`);
          }
        } else {
          console.log(`\nNot running: '${tagCmd}'`);
          console.log(`Run '${tagCmd}' to tag.`);
          console.log(`Run '${tagRemoteCmd}' to tag in remote.`);
        }
        console.log('Check that everything is ok and push to origin');
      } else {
        console.log(`\nRunning: '${unTagCmd}'`);
        console.log(`Run '${unTagRemoteCmd}' to untag in remote.`);
        await execa(unTagCmd, {
          shell: true,
          stdio: 'inherit',
        });
      }
    },
  })
  .help().argv;
