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
    })
  },
})
.help().argv;
