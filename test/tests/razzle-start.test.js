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
      shell.cd(path.join(util.rootDir, 'examples/basic'));
    });

    it('should start a dev server', () => {
      jest.setTimeout(1000000);
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec('./node_modules/.bin/razzle start', () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('Server-side HMR Enabled!')) {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3001/static/js/bundle.js'
            );
            outputTest = devServerOutput.stdout.includes('React');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    it('should build and run', () => {
      jest.setTimeout(400000);
      let outputTest;
      shell.exec('./node_modules/.bin/razzle build');
      const run = new Promise(resolve => {
        const child = shell.exec('node build/server.js', () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('> Started on port 3000')) {
            shell.exec('sleep 5');
            const output = shell.exec('curl -I localhost:3000');
            outputTest = output.stdout.includes('200');
            kill(child.pid);
          }
        });
      });
      return run.then(test => expect(test).toBe(true));
    });

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
