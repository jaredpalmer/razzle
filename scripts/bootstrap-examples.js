const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();
const defaultExample = 'packages/create-razzle-app/templates/default';

let argv = yargs
  .usage('$0 [<example>...] [-s|--stage=<stage>] [-c|--copy-only] [-a|--all]')
  .command({
    command: '*',
    builder: yargs => {
      return yargs
        .option('c', {
          alias: 'copy-only',
          describe: 'only copy',
          type: 'boolean',
          default: false,
        })
        .option('a', {
          alias: 'all',
          describe: 'bootstrap all',
          type: 'boolean',
          default: false,
        })
        .option('s', {
          alias: 'stage',
          describe: 'stage directory',
          default: false,
          type: 'string'
        })
        .option('d', {
          alias: 'default',
          describe: 'bootstrap default example',
          type: 'boolean',
          default: false,
        });
    },
    handler: async argv => {

      const packageJsonData = JSON.parse(
        await fs.readFile(path.join(rootDir, 'package.json'))
      );

      const packageMetaData = JSON.parse(
        await fs.readFile(path.join(rootDir, 'package.meta.json'))
      );

      const examples = (
        await fs.readdir(path.join(rootDir, 'examples'), {
          withFileTypes: true,
        })
      )
        .filter(item => item.isDirectory())
        .map(item => item.name);

      const exampleNames = (argv.all
        ? [defaultExample].concat(examples)
        : argv._).map(example => {
          return example.includes('/') ? example : `examples/${example}`;
        });

      if (exampleNames && !argv.all) {
        const missing = exampleNames
          .map(example => {        console.log(example);

            if (!fs.existsSync(path.join(rootDir, example, 'package.json'))) {
              return example;
            }
            return false;
          })
          .filter(x => Boolean(x));          console.log(missing);

          if (missing.length) {
            console.log(`${missing.join(', ')} not found in ${rootDir}`);
          }
      }
      packageJsonData.workspaces = packageJsonData.workspaces.concat(exampleNames);
      const jsonString = JSON.stringify(packageJsonData, null, '  ') + '\n';
      if (jsonString) {
        try {
          fs.writeFileSync(path.join(rootDir, 'package.json'), jsonString);
        } catch {
          console.log(`failed to write json ${item}`);
        }
      } else {
        console.log(`not writing empty json ${item}`);
      }

      await execa("yarn install --no-lockfile", { shell: true, stdio: 'inherit' });

      packageJsonData.workspaces = packageMetaData.workspaces;
      const resetJsonString = JSON.stringify(packageJsonData, null, '  ') + '\n';
      if (resetJsonString) {
        try {
          fs.writeFileSync(path.join(rootDir, 'package.json'), resetJsonString);
        } catch {
          console.log(`failed to write json ${item}`);
        }
      } else {
        console.log(`not writing empty json ${item}`);
      }

    },
  })
  .help().argv;
