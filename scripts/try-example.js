const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');
const util = require('../test/fixtures/util');

let argv = yargs
.usage('$0 <example> <stage> [-c|--copy-only]')
.command({
  command: '*',
  builder: (yargs) => {
    return yargs.option('c', {
      alias: 'copy-only',
      describe: 'only copy',
      default: false
    })
  },
  handler: argv => {
    const exampleName = argv._[0];
    const stageName = argv._[1] || 'example';
    console.log(`Setting up ${exampleName} with yalc as ${stageName}`)
    util.yalcSetupStageWithExample(
      stageName,
      exampleName
    );
  }
})
.help()
.argv
