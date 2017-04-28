#!/usr/bin/env node
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const fs = require('fs');
const ncp = require('ncp').ncp;
const chalk = require('chalk');
const { _: [command] } = argv;
const packageJson = require('./../package.json');

const spawn = require('execa');
const path = require('path');

if (command === 'start') {
  spawn.sync('node', [path.resolve(__dirname, '..', 'scripts/start.js')], {
    stdio: 'inherit',
  });
} else if (command === 'build') {
  spawn.sync('node', [path.resolve(__dirname, '..', 'scripts/build.js')], {
    stdio: 'inherit',
  });
} else if (command === 'init') {
  console.log();
  console.log(
    chalk.magenta(
      `
      :::::::::      :::     ::::::::: ::::::::: :::        :::::::::: 
     :+:    :+:   :+: :+:        :+:       :+:  :+:        :+:         
    +:+    +:+  +:+   +:+      +:+       +:+   +:+        +:+          
   +#++:++#:  +#++:++#++:    +#+       +#+    +#+        +#++:++#      
  +#+    +#+ +#+     +#+   +#+       +#+     +#+        +#+            
 #+#    #+# #+#     #+#  #+#       #+#      #+#        #+#             
###    ### ###     ### ######### ######### ########## ##########             
`
    )
  );
  console.log(chalk.magenta('[1/2] 🛠  Creating a new Razzle project...'));
  const { _: [, dest] } = argv;
  const finalDest = path.resolve(process.cwd(), dest);
  ncp(path.resolve(__dirname, '..', 'template'), finalDest, function(err) {
    if (err) return console.error(err);
    console.log(chalk.magenta('[2/2] ✨  Adding that razzle-dazzle...'));
    console.log();
    try {
      fs.renameSync(
        path.resolve(finalDest, '.npmignore'),
        path.resolve(finalDest, '.gitignore')
      );
    } catch (e) {} // if no .npmignore, already .gitignore
    process.chdir(finalDest);
    spawn('yarn', ['install'], { stdio: 'inherit' })
      .then(() => {
        console.log();
        console.log();
        console.log();
        console.log(`Success! Created ${dest} at ${finalDest}`);
        console.log('Inside that directory, you can run several commands:');
        console.log();
        console.log(chalk.cyan('  yarn start'));
        console.log('    Starts the development server.');
        console.log();
        console.log(chalk.cyan('  yarn build'));
        console.log('    Bundles the client and server for production.');
        console.log();
        console.log(chalk.cyan('  yarn start:prod'));
        console.log('    Starts your application in production.');
        console.log();
        console.log();
        console.log('We suggest that you begin by typing:');
        console.log();
        console.log(chalk.cyan('  cd'), dest);
        console.log(`  ${chalk.cyan('yarn start')}`);
        console.log();
      })
      .catch(e => {
        console.error(e);
      });
  });
} else if (!command && (argv.v || argv.version)) {
  console.log(chalk.cyan(`Razzle ${packageJson.version}`));
} else {
  console.log(chalk.red('Valid commands: start; build; init'));
}
