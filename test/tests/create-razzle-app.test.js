'use strict';

const shell = require('shelljs');
const path = require('path');
const { rootDir } = require('../fixtures/util');
const { run } = require('../utils/common');
const craDir = `packages/create-razzle-app/`;
const buildDir = path.join(rootDir, `build`);
const bin = path.join(rootDir, craDir, `bin/create-razzle-app`);
const packager = 'npm'; // Relying on npm for tests rather than yarn to avoid conflicts with Yarn Workspaces.
const timeout = 150000;
shell.config.silent = true;

describe('create-react-app', () => {
  it(
    'should create and run app',
    async () => {
      const name = 'myapp';

      expect(await build({ cmd: `${bin} ${name}` })).toBe(0);

      expect(shell.test('-d', `${buildDir}/${name}`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/src/server.js`)).toBe(true);
      expect(shell.test('-f', `${buildDir}/${name}/src/index.js`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/package-lock.json`)).toBe(
        true
      );

      try {
        expect(
          await run({
            main: `cd ${buildDir}/${name} && ${packager} start`,
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
    'should create app from examples',
    async () => {
      const name = 'elm';

      expect(await build({ cmd: `${bin} --example with-elm ${name}` })).toBe(0);

      expect(shell.test('-d', `${buildDir}/${name}`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/package-lock.json`)).toBe(
        true
      );
      expect(shell.test('-f', `${buildDir}/${name}/elm-package.json`)).toBe(
        true
      );
      expect(shell.test('-f', `${buildDir}/${name}/razzle.config.js`)).toBe(
        true
      );

      // Indirectly tests `yarn init:bin`
      try {
        expect(
          await run({
            main: `cd ${buildDir}/${name} && ${packager} start`,
            print: 'curl -sb -o "" localhost:3001/static/js/bundle.js',
            matches: ['Compiled successfully', 'Main.elm'],
          })
        ).toBe(true);
      } catch (error) {
        throw error;
      }
    },
    timeout
  );

  afterEach(() => {
    shell.rm('-rf', buildDir);
  });
});

async function build({ cmd }) {
  return await new Promise(resolve => {
    shell.exec(cmd, code => {
      resolve(code);
    });
  });
}
