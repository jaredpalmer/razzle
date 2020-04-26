/**
 * @jest-environment node
 */
"use strict";

const shell = require("shelljs");
const util = require("../fixtures/util");
const kill = require("../utils/psKill");
const path = require("path");

shell.config.silent = true;

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
        const child = shell.exec(`${path.join('./node_modules/.bin/razzle')} start`, () => {
          resolve(outputTest);
        });
        child.stdout.on("data", (data) => {
          if (data.includes("Server-side HMR Enabled!")) {
            shell.exec("sleep 5");
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3001/static/js/bundle.js'
            );
            outputTest = devServerOutput.stdout.includes("React");
            kill(child.pid);
          }
        });
      });
      return run.then((test) => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000; // eslint-disable-line no-undef

    it('should start a dev server on different port', () => {
      util.setupStageWithExample(stageName, 'with-custom-devserver-options');
      let outputTest;
      const run = new Promise(resolve => {
        const child = shell.exec(`${path.join('./node_modules/.bin/razzle')} start`, () => {
          resolve(outputTest);
        });
        child.stdout.on("data", (data) => {
          if (data.includes("Server-side HMR Enabled!")) {
            shell.exec("sleep 5");
            const devServerOutput = shell.exec(
              'curl -sb -o "" localhost:3002/static/js/bundle.js'
            );
            outputTest = devServerOutput.stdout.includes(
              "index.js?http://localhost:3002"
            );
            kill(child.pid);
          }
        });
      });
      return run.then((test) => expect(test).toBeTruthy());
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = 400000; // eslint-disable-line no-undef

    it('should build and run', () => {
      util.setupStageWithExample(stageName, 'basic');
      let outputTest;
      shell.exec(`${path.join('./node_modules/.bin/razzle')} build`);
      const run = new Promise(resolve => {
        const child = shell.exec(`node ${path.join('build/server.js')}`, () => {
          resolve(outputTest);
        });
        child.stdout.on("data", (data) => {
          if (data.includes("> Started on port 3000")) {
            shell.exec("sleep 5");
            const output = shell.exec("curl -I localhost:3000");
            outputTest = output.stdout.includes("200");
            kill(child.pid);
          }
        });
      });
      return run.then((test) => expect(test).toBeTruthy());
    });

    afterEach(() => {
      util.teardownStage(stageName);
    });
  });
});
