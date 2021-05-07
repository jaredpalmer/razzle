/**
 * @jest-environment node
 */
'use strict';

const fs = require('fs');
const shell = require('shelljs');
const util = require('../fixtures/util');
const kill = require('../utils/psKill');
const path = require('path');

const silent = !process.env.NOISY_TESTS;
shell.config.verbose = !silent;
shell.config.silent = silent;

process.env.RAZZLE_NONINTERACTIVE = "true";

const spew = false;

const stageName = 'stage-start';

describe('razzle start', () => {
  describe('razzle basic example', () => {
    beforeAll(() => {
      util.teardownStage(stageName);
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server', () => {
      util.setupStageWithExample(stageName, 'basic');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`${path.join('../node_modules/.bin/razzle')} start --verbose`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (!silent) console.log(data);
          if (data.includes('Server-side HMR Enabled!') && typeof outputTest == 'undefined') {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3001/static/js/client.js'
            );
            if (spew) console.log('devServerOutput:' + devServerOutput.stdout);
            outputTest = devServerOutput.stdout.includes('React');
            kill(child.pid, 'SIGINT');
          }
        });
        child.stderr.on('data', data => {
          if (!silent) console.log('stderr:' + data);
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server on different port', () => {
      util.setupStageWithExample(stageName, 'with-custom-devserver-options');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`${path.join('../node_modules/.bin/razzle')} start --verbose`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (!silent) console.log(data);
          if (data.includes('Server-side HMR Enabled!') && typeof outputTest == 'undefined') {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3002/static/js/client.js'
            );
            if (spew) console.log('devServerOutput:' + devServerOutput.stdout);
            outputTest = devServerOutput.stdout.includes(
              'index.js?http://localhost:3002'
            );
            kill(child.pid, 'SIGINT');
          }
        });
        child.stderr.on('data', data => {
          if (!silent) console.log('stderr:' + data);
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server with custom environment variables on different port', () => {
      util.setupStageWithExample(stageName, 'with-custom-environment-variables');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`node ${path.join('./node_modules/razzle/bin/razzle.js')} start --verbose`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('Server-side HMR Enabled!')) {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:4001/static/js/client.js'
            );
            outputTest = devServerOutput.stdout.includes(
              'index.js?http://localhost:4001'
            );
            kill(child.pid, 'SIGINT');
          }
        });
        child.stderr.on('data', data => {
          console.log(data);
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should start a dev server with react refresh', () => {
      util.setupStageWithExample(stageName, 'with-experimental-refresh');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`node ${path.join('./node_modules/razzle/bin/razzle.js')} start --verbose`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (data.includes('Server-side HMR Enabled!')) {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3001/static/js/client.js'
            );
            outputTest = devServerOutput.stdout.includes(
              'index.js?http://localhost:3001'
            );
            kill(child.pid, 'SIGINT');
          }
        });
        child.stderr.on('data', data => {
          console.log(data);
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build and run', () => {
      util.setupStageWithExample(stageName, 'basic');
      let outputTest;
      shell.exec(`${path.join('../node_modules/.bin/razzle')} build --noninteractive`);
      const run = new Promise(resolve => {
        const child = shell.exec(`node ${path.join('build/server.js')}`, () => {
          resolve(outputTest);
        });
        child.stdout.on('data', data => {
          if (!silent) console.log(data);
          if (data.includes('> Started on port 3000') && typeof outputTest == 'undefined') {
            shell.exec('sleep 5');
            const output = shell.exec('curl -I localhost:3000');
            if (spew) console.log('serverOutput:' + output.stdout);
            outputTest = output.stdout.includes('200');
            kill(child.pid, 'SIGINT');
          }
        });
        child.stderr.on('data', data => {
          if (!silent) console.log('stderr:' + data);
        });
      });
      return run.then(test => expect(test).toBeTruthy());
    });

    it('should exit with an error code and display the error when the custom config throws an error', () => {
      const stagePath = util.setupStageWithExample(stageName, 'basic');
      fs.writeFileSync(
        path.join(stagePath, 'razzle.config.js'),
        `
        module.exports = {
          modifyWebpackConfig() {
            throw new Error("Oops");
          }
        }
      `
      );

      return new Promise((resolve, reject) => {
        shell.exec(
          `node ${path.join(
            '../node_modules/razzle/bin/razzle.js'
          )} start --verbose`,
          { timeout: 5000 },
          (returnCode, stdout) => {
            if (returnCode === 1 && stdout.includes('Error: Oops')) {
              resolve();
            } else {
              reject('Unexpected successful return code.');
            }
          }
        );
      });
    });

    afterEach(() => {
      util.teardownStage(stageName);
    });
  });
});
