'use strict';

const updateSection = require('update-section');
const transform = require('doctoc/lib/transform');
const fs = require('fs-extra');
const path = require('path');

const rootDir = process.cwd();

var insert = '<!-- INSERT doctoc generated TOC please keep comment here to allow auto update -->\n';

const insertRe = /<!-- INSERT doctoc .*$/m;

function matchesStart(line) {
  return (/<!-- START doctoc /).test(line);
}

function matchesEnd(line) {
  return (/<!-- END doctoc /).test(line);
}

function stripGetToc(content) {
  let lines = content.split('\n')
    , info = updateSection.parse(lines, matchesStart, matchesEnd);
  if (info.hasStart&&info.hasEnd) {
    return {
      stripped: lines.slice(0, info.startIdx).join('\n') +
        lines.slice(info.endIdx+1).join('\n'),
      toc: lines.slice(info.startIdx, info.endIdx+1).join('\n')
    }
  }
  return {
    stripped: content
  }
}

const docs = [
  path.join(rootDir, 'README.md'),
  path.join(rootDir, '.github', 'CODE_OF_CONDUCT.md'),
  path.join(rootDir, '.github', 'CONTRIBUTING.md'),
];

for (let doc of docs) {
  fs.readFile(doc).then(data=>{
    const tocInfo = stripGetToc(data.toString());
    const newToc = transform(tocInfo.stripped).data;
    const newTocInfo = stripGetToc(newToc);
    return newTocInfo.stripped.replace(insertRe, insert + newTocInfo.toc);
  }).then(data=>{
    return fs.writeFile(doc, data);
  }).catch(err=>{
    console.log(err)
  })
}
