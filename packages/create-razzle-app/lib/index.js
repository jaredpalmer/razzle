'use strict';

const path = require('path');
const fs = require('fs');
const Promise = require('promise');
const axios = require('axios');
const httpAdapter = require('axios/lib/adapters/http');
const copyDir = require('./utils/copy-dir');
const install = require('./utils/install');
const loadExample = require('./utils/load-example');
const loadGitHubExample = require('./utils/load-github-example');
const loadGitExample = require('./utils/load-git-example');
const loadNpmExample = require('./utils/load-npm-example');
const messages = require('./messages');
const officialExamples = require('./officialExamples');

const isFolder = ({ type }) => type === 'dir';
const prop = key => obj => obj[key];

const branch = 'canary'; // this line auto updates when yarn update-examples is run
const razzlePkg = `razzle${branch == 'master' ? '' : '@' + branch}`;
const razzleDevUtilsPkg = `razzle-dev-utils${branch == 'master' ? '' : '@' + branch}`;


module.exports = async function createRazzleApp(opts) {
  const projectName = opts.projectName;

  if (!projectName) {
    console.log(messages.missingProjectName());
    process.exit(1);
  }

  if (fs.existsSync(projectName)) {
    console.log(messages.alreadyExists(projectName));
    process.exit(1);
  }

  const projectPath = (opts.projectPath = process.cwd() + '/' + projectName);

  if (opts.example) {
    if (/^https:\/\/github/.test(opts.example)) {
      if (opts.verbose) {
        console.log(`Using github ${opts.example} example`)
      }
      loadGitHubExample({
        projectName: projectName,
        example: opts.example,
      })
      .then(installWithMessageFactory(opts, true))
      .catch(function(err) {
        console.error(`Failed loading github ${opts.example} example`);
        if (opts.verbose) {
          console.error(err);
        }
        process.exit(1)
      });
    } else if (/^git\+/.test(opts.example)) {
      if (opts.verbose) {
        console.log(`Using git ${opts.example} example`)
      }
      loadGitExample({
        projectName: projectName,
        example: opts.example,
      })
      .then(installWithMessageFactory(opts, true))
      .catch(function(err) {
        console.error(`Failed loading git ${opts.example} example`);
        if (opts.verbose) {
          console.error(err);
        }
        process.exit(1)
      });
    } else if (/^file:/.test(opts.example)) {
      if (opts.verbose) {
        console.log(`Using file ${opts.example} example`)
      }
      const examplePath = opts.example.slice(5);
      copyDir({
        templatePath: examplePath,
        projectPath: projectPath,
        projectName: projectName,
      })
      .then(installWithMessageFactory(opts, true))
      .catch(function(err) {
        console.error(`Failed loading file ${opts.example} example`);
        if (opts.verbose) {
          console.error(err);
        }
        process.exit(1)
      });
    } else {
      if (officialExamples.includes(opts.example)) {
        if (opts.verbose) {
          console.log(`Using official ${opts.example} example`)
        }
        loadExample({
          projectName: projectName,
          example: opts.example,
          verbose: opts.verbose,
        })
        .then(installWithMessageFactory(opts, true))
        .catch(function(err) {
          console.error(`Failed loading official ${opts.example} example`);
          if (opts.verbose) {
            console.error(err);
          }
          process.exit(1)
        });
      } else {
        if (opts.verbose) {
          console.log(`Using npm ${opts.example} example`)
        }
        loadNpmExample({
          projectName: projectName,
          example: opts.example,
        })
        .then(installWithMessageFactory(opts, true))
        .catch(function(err) {
          console.error(`Failed loading official ${opts.example} example`);
          if (opts.verbose) {
            console.error(err);
          }
          process.exit(1)
        });
      }
    }
  } else {
    if (opts.verbose) {
      console.log(`Using official default example`)
    }
    const templatePath = path.resolve(__dirname, '../templates/default');

    copyDir({
      templatePath: templatePath,
      projectPath: projectPath,
      projectName: projectName,
    })
    .then(installWithMessageFactory(opts))
    .catch(function(err) {
      console.error(`Failed loading official ${opts.example} example`);
      if (opts.verbose) {
        console.error(err);
      }
      process.exit(1)
    });
  }
};

function installWithMessageFactory(opts, isExample = false) {
  const projectName = opts.projectName;
  const projectPath = opts.projectPath;

  if (!opts.install) {
    return function() {
      console.log(messages.start(projectName));
    };
  }

  return function installWithMessage() {
    return install({
      npm: opts.npm,
      yarn: opts.yarn,
      projectName: projectName,
      projectPath: projectPath,
      packages: isExample
        ? [razzlePkg, razzleDevUtilsPkg]
        : [
            'react',
            'react-dom',
            'react-router-dom',
            razzlePkg,
            razzleDevUtilsPkg,
            'express',
          ],
    })
      .then(function() {
        console.log(messages.start(projectName, opts));
      })
      .catch(function(err) {
        throw err;
      });
  };
}
