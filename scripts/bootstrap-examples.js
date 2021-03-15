const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const rootDir =  path.resolve(__dirname, '..');
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

      const exampleNamesMap = (argv.all
        ? [defaultExample].concat(examples)
        : argv._).map(example => {
          return [example, example.includes('/') ? example : `examples/${example}`];
        });

      const exampleDirs = exampleNamesMap.map(example =>example[1]);

      let extraWorkspaceDirs = [];
      let extraNoHoist = [];

      if (exampleDirs) {
        const missing = exampleDirs
          .map(example => {
            const examplePackageJson = path.join(rootDir, example, 'package.json');
            if (!fs.existsSync(examplePackageJson)) {
              return example;
            }
            let examplePackageJsonData = {};
            try {
              examplePackageJsonData = JSON.parse(fs.readFileSync(examplePackageJson));
            } catch {
              console.log(`failed to read json ${examplePackageJson}`);
              process.exit(1);
            }
            const razzle_meta = examplePackageJsonData.razzle_meta||{};
            extraNoHoist = extraNoHoist.concat((razzle_meta.nohoist||[]).map(nohoist=>`${example}/${nohoist}`))
            extraWorkspaceDirs = extraWorkspaceDirs
              .concat([example])
              .concat(razzle_meta.extraWorkspacedirs || []);
            return false;
          })
          .filter(x => Boolean(x));

          if (missing.length) {
            console.log(`${missing.join(', ')} not found in ${rootDir}`);
            process.exit(1);
          }
      }
      packageJsonData.workspaces = packageJsonData.workspaces.concat(extraWorkspaceDirs);
      packageJsonData.workspaces.nohoist = (packageJsonData.workspaces.nohoist||[]).concat(extraNoHoist);

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
      exampleDirs
        .map(example => {
          fs.ensureDirSync(path.join(rootDir, example, 'node_modules', '.bin'))
          fs.writeFileSync(path.join(rootDir, example, 'node_modules', '.bin', 'restrap'), `#!/usr/bin/env node
'use strict';
const execa = require('execa');
execa("cd ${rootDir} && yarn bootstrap-examples ${example}", { shell: true, stdio: 'inherit' });`);
      fs.chmodSync(path.join(rootDir, example, 'node_modules', '.bin', 'restrap'), 0o775)
        })


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
