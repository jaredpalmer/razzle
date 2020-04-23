/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');
const path = require('path');
const fs = require('fs');

shell.config.silent = true;

describe('razzle start', () => {
  describe('razzle basic example', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'examples/basic-spa'));
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server for spa mode', () => {
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(
          './node_modules/.bin/razzle start --type=spa --verbose',
          () => {
            resolve(outputTest);
          }
        );
        child.stdout.on('data', data => {
          if (data.includes('> SPA Started on port 3000')) {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3000/static/js/bundle.js'
            );
            outputTest = devServerOutput.stdout.includes('React');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build and run in spa mode', () => {
      let outputTest;
      shell.exec('./node_modules/.bin/razzle build --type=spa');
      const run = new Promise(resolve => {
        const child = shell.exec(
          './node_modules/.bin/serve -s build/public',
          () => {
            resolve(outputTest);
          }
        );
        child.stdout.on('data', data => {
          if (data.includes('http://localhost:5000')) {
            shell.exec('sleep 5');
            // we use serve package and it will run in prot 5000
            const output = shell.exec('curl -I localhost:5000');
            outputTest = output.stdout.includes('200');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
