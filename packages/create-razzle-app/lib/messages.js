'use strict';

const chalk = require('chalk');
const getInstallCmd = require('./utils/get-install-cmd');
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

exports.folderNotEmpty = function(projectName) {
  return `
Uh oh! Looks like the directory ${chalk.red(projectName)} is not empty. These files could conflict:`;
};
exports.conflictingDirectory = function(file) {
    return `  ${chalk.blue('(dir) ' + file)}`;
};
exports.conflictingFile = function(file) {
    return `  ${file}`;
};
exports.conflictingFileError = function(file) {
    return `  ${file}`;
};
exports.folderNotEmptySuggestions = function() {
    return `
Please remove these files, use an empty directory, or use a directory name that doesn't already exist to create a new one.`;
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

exports.start = function(projectName, opts) {
  const cmd = getInstallCmd(opts);

  const commands = {
    install: cmd.cmd === 'npm' ? 'npm install' : 'yarn',
    build: cmd.cmd === 'npm' ? 'npm run build' : 'yarn build',
    start: cmd.cmd === 'npm' ? 'npm run start:prod' : 'yarn start:prod',
    dev: cmd.cmd === 'npm' ? 'npm start' : 'yarn start',
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
