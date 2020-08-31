'use strict';

const execa = require('execa');
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


function updatePackageJson(example, packageJson, branch, items) {
  fs.pathExists(packageJson).then(exists => {
    if (exists) {
      fs.readFile(packageJson).then(content => {
        const tag = branch === 'canary' ? `canary` : 'latest';
        const contentString = content.toString();
        const updated = contentString.replace(new RegExp(`"(${items.join('|')})": "[^\/]*?"`, 'g'), '"$1": "' + tag + '"');
        return fs.writeFile(packageJson, updated);
      })
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

execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {shell: true}).then(({stdout}) => {
  const branch = stdout.split('\n')[0];
  fs.readdir(path.join(rootDir, 'packages'), {withFileTypes: true}).then(items => {
    const dirItems = items.filter(item => item.isDirectory())
      .map(item => item.name);

    return dirItems.map(item=>updatePackageJson(
      item, path.join(rootDir, 'packages', item, 'package.json'), branch, dirItems)
    )

  })

  const docSite = branch == 'master' ? 'https://razzlejs.org/' : 'https://razzle-git-' + branch + '.jared.vercel.app/';
  const readmePath = path.join(rootDir, 'packages', 'razzle', 'README.md');
  fs.readFile(readmePath).then(content => {
    const updated = content.toString().replace(/https:\/\/razzle.*?(\.org|\.app)\//g, docSite);
    return fs.writeFile(readmePath, updated);
  })
  const npxCmd = 'npx create-razzle-app' + ( branch == 'canary' ? '@' + branch : '');
  const startedPath = path.join(rootDir, 'website/pages/getting-started.mdx');
  fs.readFile(startedPath).then(content => {
    const updated = content.toString().replace(/npx create-razzle-app@?[^\s]*/g, npxCmd);
    return fs.writeFile(startedPath, updated);
  })
});
