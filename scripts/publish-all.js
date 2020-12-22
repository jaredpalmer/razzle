const yargs = require('yargs');
const execa = require('execa');
const fs = require('fs-extra');
const path = require('path');

let argv = yargs
.usage('$0 [-r|--release-tag] [-s|--semver-keyword]')
.command({
  command: '*',
  builder: (yargs) => {
      return yargs.option('r', {
        alias: 'release-tag',
        describe: 'the npm release tag',
        default: 'latest'
      }).option('s', {
        alias: 'semver-keyword',
        describe: 'the semver keyword',
        default: 'patch'
      })
    },
    handler: argv => {
      console.log(argv)

      const releaseTag = argv.releaseTag;
      const semverKeyword = releaseTag !== 'latest' ?
        argv.semverKeyword == 'patch' ? 'prerelease' : argv.semverKeyword
        : argv.semverKeyword;

      const lernaCmd = releaseTag == 'latest' ?
        `lerna version ${semverKeyword} --force-publish --no-push` :
        `lerna version ${semverKeyword} --preid ${releaseTag} --force-publish --no-push`;
      execa(lernaCmd, {shell: true, stdio: 'inherit' }).then(async ({exitCode})=>{
        if (exitCode===0) {
          const latestTagId = (await execa('git rev-list --tags --max-count=1', {shell: true})).stdout;
          const latestTag = (await execa(`git describe --tags ${latestTagId}`, {shell: true})).stdout;
          console.log(`deleting tag ${latestTag}`);
          await execa(`git tag -d ${latestTag}`, {shell: true, stdio: 'inherit' });
          console.log(`soft resetting head one rev`);
          await execa(`git reset --soft HEAD~1`, {shell: true, stdio: 'inherit' });
          console.log(`running pre-publish-all`);
          await execa(`yarn pre-publish-all`, {shell: true, stdio: 'inherit' });
          console.log(`comitting pre-publish-all changes`);
          await execa(`git commit -am "published ${latestTag}"`, {shell: true, stdio: 'inherit' });
          console.log(`retagging release`);
          await execa(`git tag -am "${latestTag}" ${latestTag}`, {shell: true, stdio: 'inherit' });
          console.log(`pushing to origin`);
          await execa(`git push origin`, {shell: true, stdio: 'inherit' });
          console.log(`pushing tags to origin`);
          await execa(`git push --tags origin`, {shell: true, stdio: 'inherit' });
          console.log(`done`);
        }
      });
    }
  })
  .help()
  .argv
