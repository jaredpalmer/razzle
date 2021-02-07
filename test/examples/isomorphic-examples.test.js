/**
* @jest-environment node
*/
'use strict';

var assert = require('assert');
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

describe(`tests for isomorphic examples`, () => {

  examples.forEach(example => {
    describe(`tests for the ${example} example`, () => {

      let tempDir;

      beforeAll(function(done) {
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

      it(`should build successfully`, function(done) {
        execa("yarn", ["build"], {stdio: 'inherit', cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)
          done();
        })
      });

      jest.setTimeout(300000);

      it(`should start devserver and exit`, function(done) {
        execa("yarn", ["start"], {stdio: 'inherit', cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)
          done();
        })
      }, 300000);

    });
  });
});
