/**
* @jest-environment node
*
* Theese test checks that the examples installs with packages from npm,
* that they build, the dev server runs as expected and is reachable at port 3000
*/
'use strict';
//
//
//
// require('leaked-handles').set({
//     fullStack: true, // use full stack traces
//     timeout: 30000, // run every 30 seconds instead of 5.
//     debugSockets: true // pretty print tcp thrown exceptions.
// });


const puppeteer = require('puppeteer');
const terminate = require('terminate');

const assert = require('assert');
const os = require('os');
const fs = require('fs-extra');
const rfs = require('fs');
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
const testArtifactsDir = path.join(rootDir, 'test-artifacts');

const silent = !process.env.NOISY_TESTS;
const stdio = 'pipe';

const useCra = process.env.NPM_TAG !== 'development';

const use_package_manager = typeof process.env.PACKAGE_MANAGER === 'undefined' ? 'default' : process.env.PACKAGE_MANAGER;

const package_manager = use_package_manager === 'default' ? 'yarn' : use_package_manager;

const cra_package_manager = use_package_manager === 'default' ? false : use_package_manager;

const install_deps_args = package_manager === 'yarn' ?
[ "install", "--ignore-engines" ] :
[ "install" ];

const webpack_deps = typeof process.env.WEBPACK_DEPS !== 'undefined' ? process.env.WEBPACK_DEPS.split(' ') : false;

const add_webpack_deps_args = package_manager === 'yarn' ?
[ "add", "--dev" ].concat(webpack_deps).concat([ "--ignore-engines" ]) :
[ "install", "--save-dev"].concat(webpack_deps);

const use_npm_tag = typeof process.env.NPM_TAG === 'undefined' ? '' : `@${process.env.NPM_TAG}`;

const writeLogs = true;

let examples =
    { simple: [
      { example: 'basic', path: 'examples/basic' },
      { example: 'basic-spa', path: 'examples/basic-spa' },
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
      { example: 'with-now', path: 'examples/with-now' },
      { example: 'with-now-v2', path: 'examples/with-now-v2' },
      { example: 'with-polka', path: 'examples/with-polka' },
      { example: 'with-preact', path: 'examples/with-preact' },
      {
        example: 'with-promise-config',
        path: 'examples/with-promise-config'
      },
      {
        example: 'with-react-native-web',
        path: 'examples/with-react-native-web'
      },
      { example: 'with-react-router', path: 'examples/with-react-router' },
      {
        example: 'with-react-server-components',
        path: 'examples/with-react-server-components'
      },
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
    ], complex: [
    { example: 'with-monorepo', path: 'examples/with-monorepo' }, // test timing ssues
    {
      example: 'with-module-federation', // test timing ssues
      path: 'examples/with-module-federation'
    },
    { example: 'with-reason-react', path: 'examples/with-reason-react' }, // test timing ssues
    {
      example: 'with-typeorm-graphql', // test timing ssues
      path: 'examples/with-typeorm-graphql'
    },
    // { example: 'with-elm', path: 'examples/with-elm' }, // requires elm binary
    // {
    //   example: 'with-devcert-https', // may not be possible to test
    //   path: 'examples/with-devcert-https'
    // }
  ]
};

let browser;
let page;

beforeAll(async function(done) {
  browser = await puppeteer.launch({ headless: process.env.HEADLESS !== "false"  });
  page = await browser.newPage();
  await fs.ensureDir(testArtifactsDir);
  // const res = await glob('examples/*')
  // examples=res.map(ex=>({example: ex.split('/')[1], path: ex}))
  // console.log(examples)
  done();
});

afterAll(async function(done) {
  await browser.close();
  await new Promise((r) => setTimeout(r, 3000));
  done();
});
Object.keys(examples).forEach((exampleType) => {


  describe(`tests for ${exampleType} isomorphic examples`, () => {

    examples[exampleType].forEach(exampleinfo => {
      const example=exampleinfo.example;

      describe(`tests for the ${example} example`, () => {
        let tempDir;
        let craDir;
        let razzleMeta;

        beforeAll(async function(done) {

          razzleMeta = JSON.parse(await fs.readFile(
            path.join(rootDir, exampleinfo.path, 'package.json'))).razzle_meta||{};

          mkdtemp(mkdtempTpl, (err, directory) => {
            tempDir = directory;
            craDir = path.join(directory, 'example');

            if (!useCra) {
              copy(path.join(rootDir, exampleinfo.path), tempDir, { dot: true },async function(error, results) {
                if (error) {
                  console.error('Copy failed: ' + error);
                } else {
                  // console.info('Copied ' + results.length + ' files');
                }
                done();
              })
            } else {
              done();
            }
          })
        });

        afterAll(async function(done) {
          fs.remove(tempDir, err => {
            assert(!err)
            done();
          });
        });

        jest.setTimeout(300000);

        it(`should install packages`, async function(done) {
          if (!useCra) {
            const subprocess = execa(package_manager,
              install_deps_args,
              {stdio: stdio, cwd: tempDir, all: writeLogs })

            if (writeLogs) {
              const write = rfs.createWriteStream(
                path.join(testArtifactsDir, `${example}-${package_manager}-install.txt`));
              subprocess.all.pipe(write);
            }

            subprocess.then(({exitCode})=>{
              assert.equal(exitCode, 0)
              done();
            })
            await subprocess;
          } else {
            console.log("Skipped install packages");
            done();
          }
        }, 300000);

        it(`should run create-razzle-app successfully`, async function(done) {

          if (useCra) {
            const subprocess = execa("npx", [
              `create-razzle-app${use_npm_tag}`,,
              cra_package_manager && `--${cra_package_manager}`,
              "--verbose",
              "--example",
              example,
              "example"
            ].filter(x=>x), {stdio: stdio, cwd: tempDir, all: writeLogs });
            if (writeLogs) {
              const write = rfs.createWriteStream(
                path.join(testArtifactsDir, `${example}-create-razzle-app.txt`));
              subprocess.all.pipe(write);
            }

            subprocess.then(async ({exitCode})=>{
              assert.equal(exitCode, 0)
              done();
            })
            await subprocess;
          } else {
            console.log("Skipped run create-razzle-app successfully");
            done();
          }
        }, 300000);

        jest.setTimeout(300000);

        it(`should use specific webpack and html-webpack-plugin`, async function(done) {
          if (webpack_deps && !razzleMeta.forceWebpack) {
            console.log(`Installing ${webpack_deps.join(' ')} using ${package_manager}`);
            const subprocess = execa(package_manager,
              add_webpack_deps_args
            , {stdio: stdio, cwd: useCra ? craDir : tempDir, all: writeLogs });
            if (writeLogs) {
              const write = rfs.createWriteStream(
                path.join(testArtifactsDir, `${example}-add-deps.txt`));
              subprocess.all.pipe(write);
            }

            subprocess.then(({exitCode})=>{
              assert.equal(exitCode, 0)
              done();
            })
            await subprocess;
          } else {
            console.log("Skipped use specific webpack and html-webpack-plugin");
            done();
          }
        }, 300000);

        jest.setTimeout(300000);

        it(`should build successfully`, async function(done) {
          const subprocess = execa(package_manager, ["build", "--noninteractive"],
          {stdio: stdio, cwd: useCra ? craDir : tempDir, all: writeLogs })

          if (writeLogs) {
            const write = rfs.createWriteStream(
              path.join(testArtifactsDir, `${example}-${package_manager}-build.txt`));
            subprocess.all.pipe(write);
          }

          subprocess.then(({exitCode})=>{
            assert.equal(exitCode, 0)
            done();
          })
          await subprocess;
        }, 300000);

        jest.setTimeout(300000);

        it(`should start devserver and exit`, async function(done) {

          const subprocess = execa(package_manager, ["start"],
          {stdio: stdio, cwd: useCra ? craDir : tempDir, all: writeLogs })

          if (writeLogs) {
            const write = rfs.createWriteStream(
              path.join(testArtifactsDir, `${example}-${package_manager}-start.txt`));
            subprocess.all.pipe(write);
          }

          let resolved = false;
          let timer;

          await new Promise(async (r) =>{
            console.info(`${package_manager} start for ${example} `);
            const waitForData = data => {
              if (data.toString().includes('Server-side HMR Enabled!') || data.toString().includes('> SPA Started on port')) {
                resolved = true;
                subprocess.off('data', waitForData)
                clearTimeout(timer);
                r();
              }
            }
            timer = setTimeout(function() {
              if (!resolved) {
                subprocess.off('data', waitForData)
                r();
              }
            }, 15000)
            subprocess.stdout.on('data', waitForData);
          })
          if (razzleMeta.yarnStartDelay) {
            await new Promise((r) => setTimeout(r, razzleMeta.yarnStartDelay));
          }
          if (resolved) {
            await page.goto(`${razzleMeta.protocol||'http'}://localhost:${razzleMeta.port||'3000'}/`);
            await page.screenshot({ path: path.join(testArtifactsDir, `${example}.png`) });
          }

          await new Promise((r) => setTimeout(r, 2000));

          terminate(subprocess.pid, 'SIGINT', { timeout: 3000 }, async () => {
            terminate(subprocess.pid);
            assert.ok(resolved, `yarn start for ${example} failed`);
            done();
          });

        }, 300000);

      });
    });
  });

});
