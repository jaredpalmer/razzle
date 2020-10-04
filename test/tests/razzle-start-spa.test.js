/**
 * @jest-environment node
 */
"use strict";

const shell = require("shelljs");
const util = require("../fixtures/util");
const kill = require("../utils/psKill");
const path = require("path");
const fs = require("fs");

const silent = !process.env.NOISY_TESTS;
shell.config.verbose = !silent;
shell.config.silent = silent;

const spew = false;

const stageName = 'stage-start-spa';

describe('razzle start', () => {
  describe('razzle basic example', () => {

    beforeAll(() => {
      util.teardownStage(stageName);
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server for spa mode', () => {
      util.setupStageWithExample(stageName, 'basic-spa');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(
          `${path.join('../node_modules/.bin/razzle')} start`,
          () => {
            resolve(outputTest);
          }
        );
        child.stdout.on('data', data => {
          if (!silent) console.log(data);
          if (data.includes('> SPA Started on port 3000') && typeof outputTest == 'undefined') {
            shell.exec('sleep 5');
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3000/static/js/bundle.js'
            );
            if (spew) console.log('devServerOutput:' + devServerOutput.stdout);
            outputTest = devServerOutput.stdout.includes("React");
            kill(child.pid);
          }
        });
        child.stderr.on('data', data => {
          if (!silent) console.log('stderr:' + data);
        });
      });
      return run.then((test) => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build and run in spa mode', () => {
      util.setupStageWithExample(stageName, 'basic-spa');
      let outputTest;
      shell.exec(`${path.join('../node_modules/.bin/razzle')} build`);
      const run = new Promise(resolve => {
        const child = shell.exec(
          `${path.join('../node_modules/.bin/serve')} -s ${path.join('build/public')}`,
          () => {
            shell.exec('sleep 5');
            resolve(outputTest);
          }
        );
        child.stdout.on('data', data => {
          if (!silent) console.log(data);
          if (data.includes('http://localhost:5000') && typeof outputTest == 'undefined') {
            shell.exec('sleep 5');
            // we use serve package and it will run in prot 5000
            const output = shell.exec("curl -I localhost:5000");
            if (spew) console.log('serverOutput:' + output.stdout);
            outputTest = output.stdout.includes("200");
            kill(child.pid);
          }
        });
        child.stderr.on('data', data => {
          if (!silent) console.log('stderr:' + data);
        });
      });
      return run.then((test) => expect(test).toBeTruthy());
    });

    afterEach(() => {
      util.teardownStage(stageName);
    });

  });
});
