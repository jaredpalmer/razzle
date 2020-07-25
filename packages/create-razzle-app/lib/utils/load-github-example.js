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
  const [url, examplePath = ''] = example.split(/(?<!https):/);
  const [, , , user, repoBranch] = url.split('/');
  const [repo, branch = 'master'] = repoBranch.split('@');
  const id = new UUID(4).format();
  const directory = path.join(os.tmpdir(), id);
  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName);
  const tarGzUrl = `https://codeload.github.com/${user}/${repo}/tar.gz/${branch}`;

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example from ${branch} branch`
  );
  return fs
    .ensureDir(directory)
    .then(() => {
      return axios.get(tarGzUrl, {
        responseType: 'stream',
        adapter: httpAdapter,
      });
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
        templatePath: path.join(directory, `${repo}-${branch}`, examplePath),
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
