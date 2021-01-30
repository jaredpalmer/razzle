#!/usr/bin/env node
'use strict';

const sade = require('sade');
const spawn = require('react-dev-utils/crossSpawn');
const pkg = require('../package.json');
const prog = sade('razzle');
prog.version(pkg.version);

const argv = process.argv.slice(3);

prog
  .command('build')
  .describe('Build the application')
  .option(
    '-t, --type',
    'Change the application build type. Must be either `iso` or `spa`.',
    'iso'
  )
  .action(() => {
    runCommand('build', [], argv);
  });

prog
  .command('start')
  .describe('Start the application in development mode.')
  .option(
    '-t, --type',
    'Change the application build type. Must be either `iso` or `spa`.',
    'iso'
  )
  .action(() => {
    runCommand('start', [], argv);
  });

prog
  .command('export')
  .describe('Export a static version of the application in production mode.')
  .action(() => {
    runCommand('export', [], argv);
  });

prog
  .command('test')
  .describe('Runs the test watcher in an interactive mode.')
  .action(() => {
    runCommand('test', argv.filter(x=>x.includes('--inspect')), argv.filter(x=>!x.includes('--inspect')));
  });

function runCommand(script, node_args, script_args) {
  const result = spawn.sync(
    'node',
    node_args.concat([require.resolve('../scripts/' + script)]).concat(script_args),
    { stdio: 'inherit' }
  );
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log(
        'The build failed because the process exited too early. ' +
          'This probably means the system ran out of memory or someone called ' +
          '`kill -9` on the process.'
      );
    } else if (result.signal === 'SIGTERM') {
      console.log(
        'The build failed because the process exited too early. ' +
          'Someone might have called `kill` or `killall`, or the system could ' +
          'be shutting down.'
      );
    }
    process.exit(1);
  }
  process.exit(result.status);
}

prog.parse(process.argv);
