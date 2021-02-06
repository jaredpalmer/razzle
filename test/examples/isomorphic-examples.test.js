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

examples.forEach(example => {
  describe(`tests for ${example}`, () => {

    let tempDir;

    before(function(done) {
      this.timeout(10000);
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

    after(function(done) {
      fs.remove(tempDir, err => {
        assert(!err)
        done();
      });
    });

    it(`should install packages for the ${example} example`, function(done) {
       this.timeout(300000);
       execa("yarn", ["install"], {stdio: 'inherit', cwd: tempDir })
      .then(({exitCode})=>{
        assert.equal(exitCode, 0)
        done();
      })
    })
  });

});
