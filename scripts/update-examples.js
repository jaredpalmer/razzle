'use strict';

const execa = require('execa');
const util = require('util');
const glob = util.promisify(require('glob'));
const updateSection = require('update-section');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

var startInstall =
    '<!-- START install generated instructions please keep comment here to allow auto update -->\n' +
    "<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN yarn update-examples TO UPDATE -->",
  endInstall =
    '<!-- END install generated instructions please keep comment here to allow auto update -->';

function matchesStartInstall(line) {
  return /<!-- START install /.test(line);
}

function matchesEndInstall(line) {
  return /<!-- END install /.test(line);
}

function updateInstallSection(
  example,
  readme,
  branch,
  releaseBranches,
  preReleaseBranches
) {
  fs.readFile(readme).then(content => {
    let update = '';
    if (releaseBranches.includes(branch)) {
      const preReleaseBranch = preReleaseBranches.includes(branch);
      const tag = preReleaseBranch ? `@${branch}` : '';
      const info = preReleaseBranch
        ? `\nThis is the ${branch} release documentation for this example\n\n`
        : '';
      update = `${info}Create and start the example:\n\n`;
      update += `\`\`\`bash\nnpx create-razzle-app${tag} --example ${example} ${example}\n\n`;
      update += `cd ${example}\nyarn start\n\`\`\`\n`;
    } else {
      update =
        '\nThis is the development documentation for this example\n\nClone the `razzle` repository:\n\n';
      update += `\`\`\`bash\ngit clone https://github.com/jaredpalmer/razzle.git\n\n`;
      update += `cd razzle\nyarn install --frozen-lockfile --ignore-engines --network-timeout 30000\n\`\`\`\n\n`;
      update += `Create and start the example:\n\n`;
      update += `\`\`\`bash\nnode -e 'require("./test/fixtures/util").setupStageWithExample("${example}", "${example}", symlink=false, yarnlink=true, install=true, test=false);'\n\n`;
      update += `cd ${example}\nyarn start\n\`\`\`\n`;
    }
    const contentString = content.toString();
    if (matchesStartInstall(contentString)) {
      const updated = updateSection(
        contentString,
        startInstall + update + endInstall,
        matchesStartInstall,
        matchesEndInstall
      );
      return fs.writeFile(readme, updated);
    }
  });
}

function updatePackageJson(
  example,
  packageJson,
  branch,
  dependencyVersions,
  version
) {
  fs.pathExists(packageJson).then(async exists => {
    if (exists) {
      const packageJsonData = JSON.parse(await fs.readFile(packageJson));
      const newPackageJsonData = ['dependencies', 'devDependencies'].reduce(
        (acc, depType) => {
          if (acc[depType]) {
            acc[depType] = Object.keys(acc[depType]).reduce((depsAcc, dep) => {
              if (dependencyVersions[dep]) {
                depsAcc[dep] = dependencyVersions[dep];
              }

              return depsAcc;
            }, acc[depType]);
          }
          return acc;
        },
        packageJsonData
      );

      // packageJsonData['devDependencies']['webpack-dev-server'] = '';

      packageJsonData['version'] = version;

      console.log(JSON.stringify(newPackageJsonData, null, '  '));
      return fs.writeFile(
        packageJson,
        JSON.stringify(newPackageJsonData, null, '  ')
      );
    }
  });
}

execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { shell: true }).then(
  async ({ stdout }) => {
    const branch = stdout.split('\n')[0];
    const lernaJson = JSON.parse(
      await fs.readFile(path.join(rootDir, 'lerna.json'))
    );

    const exampleDependencyVersions = JSON.parse(
      await fs.readFile(
        path.join(rootDir, 'scripts', 'exampleDependencyVersions.json')
      )
    );

    const packageJsons = (
      await Promise.all(
        lernaJson.packages.map(item => glob(item + '/package.json'))
      )
    ).flat();

    const packageVersions = Object.fromEntries(
      (
        await Promise.all(
          packageJsons.map(async item => JSON.parse(await fs.readFile(item)))
        )
      ).map(item => [item.name, item.version])
    );

    const dependencyVersions = {
      ...exampleDependencyVersions,
      ...packageVersions,
    };

    const releaseBranches = lernaJson.command.publish.allowBranch;
    const preReleaseBranches = releaseBranches.filter(b => b !== 'master');

    fs.readdir(path.join(rootDir, 'examples'), { withFileTypes: true }).then(
      items => {
        return items
          .filter(item => item.isDirectory())
          .map(item => {
            updateInstallSection(
              item.name,
              path.join(rootDir, 'examples', item.name, 'README.md'),
              branch,
              releaseBranches,
              preReleaseBranches
            );
            updatePackageJson(
              item.name,
              path.join(rootDir, 'examples', item.name, 'package.json'),
              branch,
              dependencyVersions,
              lernaJson.version
            );
          });
      }
    );

    updatePackageJson(
      'default',
      path.join(
        rootDir,
        'packages',
        'create-razzle-app',
        'templates',
        'default',
        'package.json'
      ),
      branch,
      dependencyVersions,
      lernaJson.version
    );

    updatePackageJson(
      'default',
      path.join(rootDir, 'package.json'),
      branch,
      dependencyVersions,
      lernaJson.version
    );

    const loadExamplePath =
      'packages/create-razzle-app/lib/utils/load-example.js';
    fs.readFile(loadExamplePath).then(content => {
      const updated = content
        .toString()
        .replace(
          /(?=const branch.*?yarn update-examples)(.*?)'.*?'/,
          "$1'" + branch + "'"
        );
      return fs.writeFile(loadExamplePath, updated);
    });

    const installExamplePath = 'packages/create-razzle-app/lib/index.js';
    fs.readFile(installExamplePath).then(content => {
      const updated = content
        .toString()
        .replace(
          /(?=const branch.*?yarn update-examples)(.*?)'.*?'/,
          "$1'" + branch + "'"
        );
      return fs.writeFile(installExamplePath, updated);
    });
  }
);
