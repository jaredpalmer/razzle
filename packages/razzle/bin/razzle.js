#!/usr/bin/env node
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const chalk = require('chalk');
const { _: [command] } = argv;
const packageJson = require('./../package.json');

const spawn = require('execa');
const path = require('path');

if (command === 'start') {
  spawn.sync('node', [path.resolve(__dirname, '..', 'scripts/start.js')], {
    stdio: 'inherit',
  });
} else if (command === 'build') {
  spawn.sync('node', [path.resolve(__dirname, '..', 'scripts/build.js')], {
    stdio: 'inherit',
  });
} else if (!command && (argv.v || argv.version)) {
  console.log(chalk.cyan(`Razzle ${packageJson.version}`));
} else {
  console.log(chalk.red('Valid commands: start; build;'));
}
