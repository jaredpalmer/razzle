'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');
const { run } = require('../utils/common');
const path = require('path');

shell.config.silent = true;

const timeout = 30000;

describe('razzle start', () => {
  describe('razzle basic example', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'examples/basic'));
    });

    it(
      'should start a dev server',
      async () => {
        try {
          expect(
            await run({
              main: './node_modules/.bin/razzle start',
              print: 'curl -sb -o "" localhost:3001/static/js/bundle.js',
              matches: ['Compiled successfully', 'React'],
            })
          ).toBe(true);
        } catch (error) {
          throw error;
        }
      },
      timeout
    );

    it(
      'should build and run',
      async () => {
        shell.exec('./node_modules/.bin/razzle build');
        try {
          expect(
            await run({
              main: 'node build/server.js',
              print: 'curl -I localhost:3000',
              matches: ['> Started on port 3000', '200'],
            })
          ).toBe(true);
        } catch (error) {
          throw error;
        }
      },
      timeout
    );

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
