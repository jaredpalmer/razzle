/**
* @jest-environment node
*/
'use strict';

const puppeteer = require('puppeteer');
const terminate = require('terminate');

const assert = require('assert');
const os = require('os');
const fs = require('fs-extra');
const execa = require('execa');
const util = require('util');
const path = require("path");
const copy = require('recursive-copy');
const mkdtemp = util.promisify(fs.mkdtemp);
const mkdtempTpl = path.join(os.tmpdir(), 'example-');

const directoryExists = (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
const fileExists = (dirPath) => fs.existsSync(dirPath);

const rootDir = path.join(path.resolve(__dirname), '..', '..');

const silent = !process.env.NOISY_TESTS;

const examples = ['basic'];

let browser;
let page;

beforeAll(async function(done) {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  done();
});

afterAll(async function(done) {
  await browser.close();
  done();
});

describe(`tests for isomorphic examples`, () => {

  examples.forEach(example => {
    describe(`tests for the ${example} example`, () => {

      let tempDir;

      beforeAll(async function(done) {

          mkdtemp(mkdtempTpl, (err, directory) => {
          tempDir = directory;
          copy(path.join(rootDir, 'examples', example), tempDir, function(error, results) {
            if (error) {
              console.error('Copy failed: ' + error);
            } else {
              console.info('Copied ' + results.length + ' files');
            }
            done();
          })
        })
      });

      afterAll(function(done) {
        fs.remove(tempDir, err => {
          assert(!err)
          done();
        });
      });

      jest.setTimeout(300000);

      it(`should install packages`, function(done) {
        execa("yarn", ["install"], {stdio: 'inherit', cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)
          done();
        })
      }, 300000);

      it(`should build successfully`, async function(done) {
        execa("yarn", ["build"], {stdio: 'inherit', cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)

          done();
        })
      }, 300000);

      jest.setTimeout(300000);

      it(`should start devserver and exit`, async function(done) {
        const subprocess = execa("yarn", ["start"], {stdio: 'inherit', cwd: tempDir })
        await new Promise((r) => setTimeout(r, 5000));
        await page.goto('http://localhost:3000/');
        await page.screenshot({ path: 'example.png' });
        await page.goto('https://google.com');

        terminate(subprocess.pid, 'SIGINT', { timeout: 1000 }, () => {
          terminate(subprocess.pid);
          done();
        });

        // subprocess.then(({killed})=>{
        //   assert.equal(killed, true)
        // })
      }, 300000);

      jest.setTimeout(300000);
      //
      // it(`should start devserver and the page should load js`, async function(done) {

      //   const subprocess = execa("yarn", ["start"], {stdio: 'inherit', cwd: tempDir })
      //   subprocess.then(({exitCode})=>{
      //     assert.equal(exitCode, 0)
          // done();
      //   })
      // }, 300000);
    });
  });
});
