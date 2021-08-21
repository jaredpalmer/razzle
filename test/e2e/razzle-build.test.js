/**
 * @jest-environment node
 */
'use strict';

const path = require('path');
const fs = require('fs-extra');
const shell = require('shelljs');
const util = require('../fixtures/util');

const silent = !process.env.NOISY_TESTS;
shell.config.verbose = !silent;
shell.config.silent = silent;

process.env.RAZZLE_NONINTERACTIVE = "true";

const stageName = 'stage-build';

const directoryExists = (dirPath) => fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory();
const fileExists = (dirPath) => fs.existsSync(dirPath);

describe('razzle build', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // Create server.js
    expect(fileExists('build/server.js')).toBeTruthy();
    expect(fileExists('build/server.js.map')).toBeTruthy();

    // Should copy static assets from src/public directory
    expect(fileExists('build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(directoryExists('build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/client.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/client.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(directoryExists('build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(directoryExists('build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/client.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom .babelrc', () => {
    util.setupStageWithFixture(stageName, 'build-with-babelrc');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // Create server.js
    expect(fileExists('build/server.js')).toBeTruthy();
    expect(fileExists('build/server.js.map')).toBeTruthy();

    // Should copy static assets from src/public directory
    expect(fileExists('build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(directoryExists('build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/client.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/client.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(directoryExists('build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(directoryExists('build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/client.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom razzle.config.js', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-config');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // We modify the default server output filename -> custom.js
    expect(fileExists('build/custom.js')).toBeTruthy();
    expect(fileExists('build/custom.js.map')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(directoryExists('build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/client.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/client.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(directoryExists('build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(directoryExists('build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/client.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a plugin in razzle.config.js', () => {
    util.setupStageWithExample(stageName, 'with-scss');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(directoryExists('build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/client.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/client.*.js.map').code).toBe(0);

    // should compile client css to css directory
    expect(directoryExists('build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/client.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files in spa mode', () => {
    util.setupStageWithFixture(stageName, 'build-default-spa');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // Create index.html
    expect(fileExists('build/public/index.html')).toBeTruthy();

    // SHOULD NOT Create server.js
    expect(fileExists('build/server.js')).toBeFalsy();
    expect(fileExists('build/server.js.map')).toBeFalsy();

    // Should copy static assets from src/public directory
    expect(fileExists('build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(directoryExists('build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/client.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/client.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(directoryExists('build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(directoryExists('build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/client.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile with plugin options', () => {
    const stagePath = util.setupStageWithExample(stageName, 'with-scss-options');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    const assets = JSON.parse(fs.readFileSync(path.join(stagePath, 'build/assets.json')));
    const css = fs.readFileSync(path.join(stagePath, 'build', 'public', assets.client.css[0]));

    expect(css.toString().includes("razzle-scss-prepend")).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should compile with promise config', () => {
    const stagePath = util.setupStageWithExample(stageName, 'with-promise-config');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    // We modify the default server output filename -> custom.js
    expect(fileExists('build/custom.js')).toBeTruthy();
    expect(fileExists('build/custom.js.map')).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should compile with jsconfig paths', () => {
    const stagePath = util.setupStageWithExample(stageName, 'with-jsconfig-paths');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    const assets = JSON.parse(fs.readFileSync(path.join(stagePath, 'build/assets.json')));
    const js = fs.readFileSync(path.join(stagePath, 'build', 'public', assets.client.js[0]));

    expect(js.toString().includes("Something Extra")).toBeTruthy();

    expect(output.code).toBe(0);
  });

  it('should exit with an error code when the custom config is invalid', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-config-invalid');
    const output = shell.exec('yarn build', {
      silent: true,
    });

    expect(output.code).toBe(1);
  });


  it('should compile with development build', () => {
    const stagePath = util.setupStageWithExample(stageName, 'with-development-build');
    const output = shell.exec('yarn build --noninteractive');
    // Create asset manifest
    expect(fileExists('build/assets.json')).toBeTruthy();

    const assets = JSON.parse(fs.readFileSync(path.join(stagePath, 'build/assets.json')));
    const js = fs.readFileSync(path.join(stagePath, 'build', 'public', assets.client.js[0]));

    expect(output.code).toBe(0);
  });

  it('should exit with an error code when the custom config is invalid', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-config-invalid');
    const output = shell.exec('yarn build', {
      silent: true,
    });

    expect(output.code).toBe(1);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
