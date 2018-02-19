'use strict';

const path = require('path');
const fs = require('fs');
const copyDir = require('./utils/copy-dir');
const install = require('./utils/install');
const loadExample = require('./utils/load-example');
const isEnvLocal = require('./utils/env');
const messages = require('./messages');

module.exports = function createRazzleApp(opts) {
  const projectName = opts.projectName;

  if (!projectName) {
    console.log(messages.missingProjectName());
    process.exit(1);
  }

  // `isEnvLocal` allows to develop and test with local examples.
  const projectDir = isEnvLocal ? `build/${projectName}` : projectName;

  if (fs.existsSync(projectDir)) {
    console.log(messages.alreadyExists(projectName));
    process.exit(1);
  }

  const projectPath = (opts.projectPath = `${process.cwd()}/${projectDir}`);

  if (opts.example) {
    loadExample({
      projectName: projectName,
      example: opts.example,
    }).then(installWithMessageFactory(opts, true));
  } else {
    const templatePath = path.resolve(__dirname, '../templates/default');

    copyDir({
      templatePath: templatePath,
      projectPath: projectPath,
      projectName: projectName,
    })
      .then(installWithMessageFactory(opts))
      .catch(function(err) {
        throw err;
      });
  }
};

function installWithMessageFactory(opts, isExample = false) {
  const projectName = opts.projectName;
  const projectPath = opts.projectPath;

  return function installWithMessage() {
    return install({
      projectName: projectName,
      projectPath: projectPath,
      packages: isExample
        ? ['razzle']
        : ['react', 'react-dom', 'react-router-dom', 'razzle', 'express'],
    })
      .then(withInit => {
        console.log(messages.start(projectName, withInit));
      })
      .catch(err => {
        throw err;
      });
  };
}
