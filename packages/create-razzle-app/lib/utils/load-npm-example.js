'use strict';

const fs = require('fs-extra');
const pacote = require('pacote');
const axios = require('axios');
const os = require('os');
const path = require('path');
const UUID = require('pure-uuid');
const output = require('./output');
const copyDir = require('./copy-dir');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;
  const [npmPackage, examplePath = ''] = example.split(/:/);
  const id = new UUID(4).format();
  const directory = path.join(os.tmpdir(), id);
  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName);

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );
  return fs
    .ensureDir(directory)
    .then(() => {
      return pacote.extract(npmPackage, directory);
    })
    .then(function() {
      stopExampleSpinner();
      output.success(
        `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
      );
      return copyDir({
        templatePath: path.join(directory, examplePath),
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
