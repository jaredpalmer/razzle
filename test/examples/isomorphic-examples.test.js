/**
* @jest-environment node
*/
'use strict';

const puppeteer = require('puppeteer');
const terminate = require('terminate');

const assert = require('assert');
const os = require('os');
const fs = require('fs-extra');
const execa = require('execa');
const util = require('util');
const glob = util.promisify(require('glob'));

const path = require("path");
const copy = require('recursive-copy');
const mkdtemp = util.promisify(fs.mkdtemp);
const mkdtempTpl = path.join(os.tmpdir(), 'example-');

const directoryExists = (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
const fileExists = (dirPath) => fs.existsSync(dirPath);

const rootDir = path.join(path.resolve(__dirname), '..', '..');

const silent = !process.env.NOISY_TESTS;
const stdio = 'pipe';

let examples = [
      { example: 'basic', path: 'examples/basic' },
      { example: 'basic-spa', path: 'examples/basic-spa' },
      { example: 'with-afterjs', path: 'examples/with-afterjs' },
      {
        example: 'with-custom-babel-config',
        path: 'examples/with-custom-babel-config'
      },
      {
        example: 'with-custom-devserver-options',
        path: 'examples/with-custom-devserver-options'
      },
      {
        example: 'with-custom-environment-variables',
        path: 'examples/with-custom-environment-variables'
      },
      {
        example: 'with-custom-target-babel-config',
        path: 'examples/with-custom-target-babel-config'
      },
      {
        example: 'with-custom-webpack-config',
        path: 'examples/with-custom-webpack-config'
      },
      {
        example: 'with-devcert-https',
        path: 'examples/with-devcert-https'
      },
      { example: 'with-elm', path: 'examples/with-elm' },
      { example: 'with-eslint', path: 'examples/with-eslint' },
      {
        example: 'with-experimental-refresh',
        path: 'examples/with-experimental-refresh'
      },
      {
        example: 'with-firebase-functions',
        path: 'examples/with-firebase-functions'
      },
      { example: 'with-heroku', path: 'examples/with-heroku' },
      { example: 'with-hyperapp', path: 'examples/with-hyperapp' },
      { example: 'with-inferno', path: 'examples/with-inferno' },
      {
        example: 'with-jest-snapshots',
        path: 'examples/with-jest-snapshots'
      },
      {
        example: 'with-jsconfig-paths',
        path: 'examples/with-jsconfig-paths'
      },
      { example: 'with-jsxstyle', path: 'examples/with-jsxstyle' },
      { example: 'with-koa', path: 'examples/with-koa' },
      { example: 'with-less', path: 'examples/with-less' },
      {
        example: 'with-loadable-components',
        path: 'examples/with-loadable-components'
      },
      { example: 'with-material-ui', path: 'examples/with-material-ui' },
      { example: 'with-mdx', path: 'examples/with-mdx' },
      {
        example: 'with-module-federation',
        path: 'examples/with-module-federation'
      },
      { example: 'with-monorepo', path: 'examples/with-monorepo' },
      { example: 'with-now', path: 'examples/with-now' },
      { example: 'with-now-v2', path: 'examples/with-now-v2' },
      { example: 'with-polka', path: 'examples/with-polka' },
      { example: 'with-preact', path: 'examples/with-preact' },
      {
        example: 'with-promise-config',
        path: 'examples/with-promise-config'
      },
      { example: 'with-rax', path: 'examples/with-rax' },
      {
        example: 'with-react-native-web',
        path: 'examples/with-react-native-web'
      },
      { example: 'with-react-router', path: 'examples/with-react-router' },
      {
        example: 'with-react-server-components',
        path: 'examples/with-react-server-components'
      },
      { example: 'with-reason-react', path: 'examples/with-reason-react' },
      { example: 'with-redux', path: 'examples/with-redux' },
      { example: 'with-scss', path: 'examples/with-scss' },
      { example: 'with-scss-options', path: 'examples/with-scss-options' },
      {
        example: 'with-single-exposed-port',
        path: 'examples/with-single-exposed-port'
      },
      {
        example: 'with-styled-components',
        path: 'examples/with-styled-components'
      },
      { example: 'with-svelte', path: 'examples/with-svelte' },
      { example: 'with-tailwindcss', path: 'examples/with-tailwindcss' },
      {
        example: 'with-typeorm-graphql',
        path: 'examples/with-typeorm-graphql'
      },
      { example: 'with-typescript', path: 'examples/with-typescript' },
      {
        example: 'with-typescript-plugin',
        path: 'examples/with-typescript-plugin'
      },
      {
        example: 'with-vendor-bundle',
        path: 'examples/with-vendor-bundle'
      },
      { example: 'with-vue', path: 'examples/with-vue' },
      { example: 'with-vue-router', path: 'examples/with-vue-router' },
      {
        example: 'with-webpack-public-path',
        path: 'examples/with-webpack-public-path'
      }
    ];

let browser;
let page;

beforeAll(async function(done) {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  // const res = await glob('examples/*')
  // examples=res.map(ex=>({example: ex.split('/')[1], path: ex}))
  // console.log(examples)
  done();
});

afterAll(async function(done) {
  await browser.close();
  done();
});

describe(`tests for isomorphic examples`, () => {

  examples.forEach(exampleinfo => {
    const example=exampleinfo.example;
    describe(`tests for the ${example} example`, () => {

      let tempDir;

      beforeAll(async function(done) {

          mkdtemp(mkdtempTpl, (err, directory) => {
          tempDir = directory;
          copy(path.join(rootDir, exampleinfo.path), tempDir, function(error, results) {
            if (error) {
              console.error('Copy failed: ' + error);
            } else {
              console.info('Copied ' + results.length + ' files');
            }
            done();
          })
        })
      });

      afterAll(function(done) {
        fs.remove(tempDir, err => {
          assert(!err)
          done();
        });
      });

      jest.setTimeout(300000);

      it(`should install packages`, function(done) {
        execa("yarn", ["install"], {stdio: stdio, cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)
          done();
        })
      }, 300000);

      it(`should build successfully`, async function(done) {
        execa("yarn", ["build"], {stdio: stdio, cwd: tempDir })
        .then(({exitCode})=>{
          assert.equal(exitCode, 0)

          done();
        })
      }, 300000);

      jest.setTimeout(300000);

      it(`should start devserver and exit`, async function(done) {
        const subprocess = execa("yarn", ["start"], {stdio: stdio, cwd: tempDir })
        await new Promise((r) => setTimeout(r, 5000));
        await page.goto('http://localhost:3000/');
        await page.screenshot({ path: 'example.png' });
        await page.goto('https://google.com');

        terminate(subprocess.pid, 'SIGINT', { timeout: 1000 }, () => {
          terminate(subprocess.pid);
          done();
        });

        // subprocess.then(({killed})=>{
        //   assert.equal(killed, true)
        // })
      }, 300000);

      jest.setTimeout(300000);
      //
      // it(`should start devserver and the page should load js`, async function(done) {

      //   const subprocess = execa("yarn", ["start"], {stdio: stdio, cwd: tempDir })
      //   subprocess.then(({exitCode})=>{
      //     assert.equal(exitCode, 0)
          // done();
      //   })
      // }, 300000);
    });
  });
});