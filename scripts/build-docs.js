'use strict';

const execa = require('execa');
const util = require('util');
const glob = util.promisify(require('glob'));
const updateSection = require('update-section');
const transform = require('doctoc/lib/transform');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

var startDocToc = '<!-- START doctoc generated instructions please keep comment here to allow auto update -->\n' +
            '<!-- DON\'T EDIT THIS SECTION, INSTEAD RE-RUN yarn build-docs TO UPDATE -->'
  , endDocToc   = '<!-- END doctoc generated instructions please keep comment here to allow auto update -->'

var startContributors = '<!-- START contributors generated instructions please keep comment here to allow auto update -->\n' +
            '<!-- DON\'T EDIT THIS SECTION, INSTEAD RE-RUN yarn build-docs TO UPDATE -->'
  , endContributors   = '<!-- END contributors generated instructions please keep comment here to allow auto update -->'

function matchesStartDocToc(line) {
  return (/<!-- START doctoc /).test(line);
}

function matchesEndDocToc(line) {
  return (/<!-- END doctoc /).test(line);
}

function matchesStartContributors(line) {
  return (/<!-- START contributors /).test(line);
}

function matchesEndContributors(line) {
  return (/<!-- END contributors /).test(line);
}


function updatePackageJson(packageJson, branch, dependencyVersions, version) {
  fs.pathExists(packageJson).then(async exists => {
    if (exists) {
      const packageJsonData = JSON.parse(await fs.readFile(packageJson));
      const newPackageJsonData = ["dependencies", "devDependencies", "peerDependencies"].reduce((acc, depType) => {
        if (acc[depType]) {
          acc[depType] = Object.keys(acc[depType]).reduce((depsAcc, dep) => {
            if (dependencyVersions[dep] && depType == "dependencies") {
              delete depsAcc[dep]
              if (!acc.peerDependencies) acc.peerDependencies = {};
              acc.peerDependencies[dep] = dependencyVersions[dep];
            } else if (dependencyVersions[dep]) {
              depsAcc[dep] = dependencyVersions[dep];
            }

            return depsAcc;
          }, acc[depType]);
        }
        return acc;
      }, packageJsonData);

      packageJsonData['version'] = version;

      console.log(JSON.stringify(newPackageJsonData, null, '  '));
      return fs.writeFile(packageJson, JSON.stringify(newPackageJsonData, null, '  '));
    }
  })
}

const tocDocs = [
  path.join(rootDir, '.github', 'CODE_OF_CONDUCT.md'),
  path.join(rootDir, '.github', 'CONTRIBUTING.md'),
];

const contributorsDocs = [
  path.join(rootDir, 'packages', 'razzle', 'README.md'),
];

for (let tocDoc of tocDocs) {
  fs.readFile(tocDoc).then(data=>{
    return {
      headings: data.toString().replace(/^((?!#.+$).*\n)/gm, ''),
      document: data.toString()
    };
  }).then(info=>{
    const newToc = transform(info.headings).data.replace(/^((?!\s*\-.+$).*\n)/gm, '');
    const newDoc = updateSection(info.document, startDocToc+newToc+endDocToc, matchesStartDocToc, matchesEndDocToc);
    return fs.writeFile(tocDoc, newDoc);
  }).catch(err=>{
    console.log(err)
  })
}

for (let contributorsDoc of contributorsDocs) {
  fs.readFile(contributorsDoc).then(data=>{
    const allContributors = JSON.parse(fs.readFileSync(path.join(rootDir, '.all-contributorsrc')));
    const contributors = '\n' +
        allContributors.contributors.map(contributor=>`- **${contributor.name}** - [@${contributor.login}](${contributor.profile})\n` +
        `  - **Contributions:** ` + contributor.contributions.join(', ') ).join('\n')
      + '\n';
    return {
      contributors: contributors,
      document: data.toString()
    };
  }).then(info=>{
    console.log(info.contributors);
    const newDoc = updateSection(info.document, startContributors+info.contributors+endContributors, matchesStartContributors, matchesEndContributors);
    return fs.writeFile(contributorsDoc, newDoc);
  }).catch(err=>{
    console.log(err)
  })
}

execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {shell: true}).then(async ({stdout}) => {
  const branch = stdout.split('\n')[0];
  const lernaJson = JSON.parse(await fs.readFile(path.join(rootDir, 'lerna.json')));
  const internalPeerDependencyVersions = JSON.parse(await fs.readFile(
    path.join(rootDir, 'scripts', 'internalPeerDependencyVersions.json')));

  const packageJsons = (await Promise.all(lernaJson.packages.map(item =>
    glob(item+'/package.json'))
  )).flat();

  const internalPackages = Object.fromEntries((await Promise.all(packageJsons.map(async item =>
    JSON.parse(await fs.readFile(item))
  ))).map(item=>([item.name, lernaJson.version])));

  const dependencyVersions = {...internalPeerDependencyVersions, ...internalPackages};

  const releaseBranches = lernaJson.command.publish.allowBranch;
  const preReleaseBranches = releaseBranches.filter(b=>b!=='master');

  packageJsons.map(item=>updatePackageJson(item, branch, dependencyVersions, lernaJson.version))

  const docSite = branch == 'master' ? 'https://razzlejs.org/' : `https://razzle-git-${branch}.jared.vercel.app/`;
  const readmePath = path.join(rootDir, 'packages', 'razzle', 'README.md');
  fs.readFile(readmePath).then(content => {
    const updated = content.toString().replace(/https:\/\/razzle.*?(\.org|\.app)\//g, docSite);
    return fs.writeFile(readmePath, updated);
  })
  const npxCmd = 'npx create-razzle-app' + ( preReleaseBranches.includes(branch) ? `@${branch}` : '');
  const startedPath = path.join(rootDir, 'website/pages/getting-started.mdx');
  fs.readFile(startedPath).then(content => {
    const updated = content.toString().replace(/npx create-razzle-app@?[^\s]*/g, npxCmd);
    return fs.writeFile(startedPath, updated);
  })
});
