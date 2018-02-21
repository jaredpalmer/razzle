'use strict';

const exec = require('execa');
const Promise = require('promise');
const path = require('path');
const output = require('./output');
const isEnvLocal = require('./env');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;

  // cwd-agnostic resolve
  const exampleDir = name =>
    path.resolve(
      path.dirname(require.main.filename), // packages/create-razzle-app/bin
      `../../../examples/${name}/`
    );

  const cmds = isEnvLocal
    ? [
        `mkdir -p build/${projectName}`,
        `cp -a ${exampleDir(example)}/. build/${projectName}/.`,
      ]
    : [
        `mkdir -p ${projectName}`,
        `curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz -C ${projectName} --strip=3 razzle-master/examples/${example}`,
      ];

  const stopSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );

  const cmdPromises = cmds.map(cmd => exec.shell(cmd));

  return Promise.all(cmdPromises)
    .then(() => {
      stopSpinner();
      output.success(
        `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
      );
    })
    .catch(error => {
      stopSpinner();
      console.error(error);
      throw error;
    });
};
