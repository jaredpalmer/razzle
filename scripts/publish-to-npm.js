'use strict';
const yargs = require('yargs');
const execa = require('execa');
const util = require('util');
const glob = util.promisify(require('glob'));
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

let argv = yargs
  .usage(
    '$0 [-t|--tag]'
  )
  .command({
    command: '*',
    builder: yargs => {
      return yargs
        .option('t', {
          alias: 'tag',
          describe: 'the npm dist-tag',
          default: 'latest',
          type: 'string',
        });
    },
    handler: async argv => {

			const packageJsonData = JSON.parse(
				await fs.readFile(path.join(rootDir, 'package.json'))
			);

			const packageDirs = (
				await Promise.all(packageJsonData.workspaces.map((item) => glob(item)))
			).flat();

      // await execa(`npm profile get --registry=https://registry.npmjs.org/ `, { shell: true, stdio: 'inherit' });

			await Promise.all(packageDirs.map((item) => {
				const publishCmd = `npm publish --tag ${argv.tag} --registry=https://registry.npmjs.org/ --access public`;
				return execa(publishCmd, { shell: true, stdio: 'inherit', cwd: path.join(rootDir, item) });
			}))

    },
  })
  .help().argv;
