'use strict';

const fs = require('fs-extra');
const tar = require('tar');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const os = require('os');
const path = require('path');
const UUID = require('pure-uuid');
const output = require('./output');
const copyDir = require('./copy-dir');
const Promise = require('promise');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;
  const branch = 'master'; // this line auto updates when yarn update-examples is run
  const url = 'https://codeload.github.com/jaredpalmer/razzle/tar.gz/' + branch;

  const id = new UUID(4).format();
  const directory = path.join(os.tmpdir(), id);
  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName);

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example from ${branch} branch`
  );
  return fs
    .ensureDir(directory)
    .then(() => {
      return axios.get(url, { responseType: 'stream', adapter: httpAdapter });
    })
    .then(response => {
      return new Promise((resolve, reject) => {
        const stream = response.data;
        stream.on('end', () => resolve());
        stream.pipe(tar.x({ C: directory }));
      });
    })
    .then(function() {
      stopExampleSpinner();
      output.success(
        `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
      );
      return copyDir({
        templatePath: path.join(
          directory,
          'razzle-' + branch,
          'examples',
          example
        ),
        projectPath: projectPath,
        projectName: projectName,
      });
    })
    .then(function() {
      return fs.remove(directory);
    })
    .catch(function(err) {
      throw err;
    });
};
