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

      const exampleNames = argv.all
        ? [defaultExample].concat(examples)
        : argv._;
      if (exampleNames && !argv.all) {
        const missing = exampleNames
          .map(example => {
            const inProjectPath = example.includes('/') ? example : `examples/${example}`;
            if (!fs.existsSync(path.join(rootDir, inProjectPath))) {
              return inProjectPath;
            }
            return false;
          })
          .filter(x => Boolean(x));
        console.log(`${missing.join(', ')} not found in ${rootDir}`);
      }
    },
  })
  .help().argv;
