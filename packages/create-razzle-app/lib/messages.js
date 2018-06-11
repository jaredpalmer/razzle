'use strict';

const chalk = require('chalk');
const getPackager = require('./utils/get-packager');
const output = require('./utils/output');

const program = {
  name: 'create-razzle-app',
};

exports.help = function() {
  return `
    Only ${chalk.green('<project-directory>')} is required.
    If you have any problems, do not hesitate to file an issue:
      ${chalk.cyan('https://github.com/jaredpalmer/razzle/issues/new')}
  `;
};

exports.exampleHelp = function() {
  return `Example from https://github.com/jaredpalmer/razzle/tree/master/examples/ ${output.param(
    'example-path'
  )}`;
};

exports.missingProjectName = function() {
  return `
Please specify the project directory:
  ${chalk.cyan(program.name)} ${chalk.green('<project-directory>')}
For example:
  ${chalk.cyan(program.name)} ${chalk.green('my-razzle-app')}
  ${chalk.cyan(program.name)} ${chalk.cyan(
    '--example with-preact'
  )} ${chalk.green('my-preact-app')}
Run ${chalk.cyan(`${program.name} --help`)} to see all options.
`;
};

exports.alreadyExists = function(projectName) {
  return `
Uh oh! Looks like there's already a directory called ${chalk.red(
    projectName
  )}. Please try a different name or delete that folder.`;
};

exports.installing = function(packages) {
  const pkgText = packages
    .map(function(pkg) {
      return `    ${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join('\n');

  return `
  Installing npm modules:
${pkgText}
`;
};

exports.installError = function(packages) {
  const pkgText = packages
    .map(function(pkg) {
      return `${chalk.cyan(chalk.bold(pkg))}`;
    })
    .join(', ');

  output.error(`Failed to install ${pkgText}, try again.`);
};

exports.copying = function(projectName) {
  return `
Creating ${chalk.bold(chalk.green(projectName))}...
`;
};

exports.start = function(projectName) {
  const packager = getPackager();

  const commands = {
    install: packager === 'npm' ? 'npm install' : 'yarn',
    build: packager === 'npm' ? 'npm run build' : 'yarn build',
    start: packager === 'npm' ? 'npm run start:prod' : 'yarn start:prod',
    dev: packager === 'npm' ? 'npm start' : 'yarn start',
  };

  return `
  ${chalk.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${output.cmd(commands.install)} for you, so your next steps are:
    ${output.cmd(`cd ${projectName}`)}
  
  To start a local server for development:
    ${output.cmd(commands.dev)}
  
  To build a version for production:
    ${output.cmd(commands.build)}

  To run the server in production:
    ${output.cmd(commands.start)}
    
  Questions? Feedback? Please let me know!
  ${chalk.green('https://github.com/jaredpalmer/razzle/issues')}
`;
};
