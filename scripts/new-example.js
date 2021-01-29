const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

let argv = yargs
.usage(
  '$0 <from> <to> [-b|--bootstrap]')
.command({
  command: '*',
  builder: yargs => {
    return yargs
      .option('b', {
        alias: 'bootstrap',
        describe: 'bootstrap example',
        type: 'boolean',
        default: true,
      });
  },
  handler: async argv => {
    console.log(argv);
    const templatePath = path.join(rootDir, `examples/${argv._[0]}`);
    const projectPath = path.join(rootDir, `examples/${argv._[1]}`);
    const relativePath = `examples/${argv._[1]}`;
    fs.copy(templatePath, projectPath)
    .then(async function() {

          const packageJsonData = JSON.parse(
            await fs.readFile(path.join(projectPath, 'package.json'))
          );
          packageJsonData.name = `razzle-examples-${argv._[1]}`
          const jsonString = JSON.stringify(packageJsonData, null, '  ') + '\n';
            if (jsonString) {
              try {
                fs.writeFileSync(path.join(projectPath, 'package.json'), jsonString);
              } catch {
                console.log(`failed to write json ${item}`);
              }
            } else {
              console.log(`not writing empty json ${item}`);
            }
            if (argv.bootstrap) {
              execa.sync(`yarn`, ['bootstrap-examples', relativePath],
                { stdio: 'inherit', cwd: rootDir })
            }
            console.log(`Type\ncd ${relativePath}\nTo work on the new example`);

    })
  },
})
.help().argv;
