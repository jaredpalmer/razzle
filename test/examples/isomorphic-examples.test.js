/**
 * @jest-environment node
 */
'use strict';

const os = require('os');
const fs = require('fs-extra');
const execa = require('execa');
const util = require('util');
const path = require("path");

const mkdtemp = util.promisify(fs.mkdtemp);
const mkdtempTpl = path.join(os.tmpdir(), 'example-');

const directoryExists = (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
const fileExists = (dirPath) => fs.existsSync(dirPath);

const rootDir = path.join(path.resolve(__dirname), '..', '..');

const silent = !process.env.NOISY_TESTS;


describe('test isomophic examples', () => {
  const examples = ['basic'];
  examples.forEach(example => {
    describe(`tests for ${example}`, () => {

      let tempDir;

      beforeAll(async () => {
        tempDir = await mkdtemp(mkdtempTpl);
        await fs.copy(path.join(rootDir, 'examples', example), tempDir);
        return;
      });

      it(`should install packages for ${example}`, async () => {
        await execa("yarn install", { shell: true, stdio: 'inherit', cwd: tempDir });
        return true;
      });

      afterAll(async () => {
        await fs.remove(tempDir);
        return;
      });

    });
  });
});
