'use strict';

const exec = require('execa');
const Promise = require('promise');
const output = require('./output');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;
  const cmds = [
    `mkdir -p ${projectName}`,
    `curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz -C ${projectName} --strip=3 razzle-master/examples/${example}`,
  ];

  const stopExampleSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );
  const cmdPromises = cmds.map(function(cmd) {
    return exec.shell(cmd);
  });

  return Promise.all(cmdPromises).then(function() {
    stopExampleSpinner();
    output.success(
      `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
    );
  });
};
