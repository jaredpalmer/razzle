const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

let argv = yargs
.usage(
  '$0 <from> <to> '
)
.command({
  command: '*',
  handler: async argv => {
    console.log(argv);
    const templatePath = path.join(rootDir, `examples/${argv._[0]}`);
    const projectPath = path.join(rootDir, `examples/${argv._[1]}`);
    fs.copy(templatePath, projectPath)
    .then(function() {
    })
  },
})
.help().argv;
