'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const UUID = require('pure-uuid');
const output = require('./output');
const copyDir = require('./copy-dir');
const exec = require('execa');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;
  const [repoBranch, examplePath = ''] = example.slice(3).split(/(?<!\+http?s|\+ssh|\+git):/);
  const [repoUrl, branch = 'HEAD'] = repoBranch.slice(1).split('@');
  const id = new UUID(4).format();
  const idIndex = new UUID(4).format();
  const directory = path.join(os.tmpdir(), id);
  const directoryIndex = path.join(os.tmpdir(), idIndex);

  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName);

  const branchArg = branch !== 'HEAD' ? ` --branch=${branch}` : '';

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );

  return fs.ensureDir(directory).then(() => {
    return exec(
      `git clone --depth 1${branchArg} ${repoUrl} .`,
      {cwd: directory, shell: true})
  })
  .then(() => {
     return exec(
       `git checkout-index --prefix=${(directoryIndex+path.sep).replace(/\\/g, '/')} -a`,
       {cwd: directory, shell: true});
   })
  .then(function() {
    stopExampleSpinner();
    output.success(
      `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
    );
    return copyDir({
      templatePath: path.join(directoryIndex, examplePath),
      projectPath: projectPath,
      projectName: projectName,
    })
  })
  .then(function() {
    return fs.remove(directory)
  })
  .then(function() {
    return fs.remove(directoryIndex)
  })
 .catch(function(err) {
   throw err;
 });
};
