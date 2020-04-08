/**
 * @jest-environment node
 */
'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = false;

const stageName = 'stage-build';

describe('razzle build', () => {
  beforeAll(() => {
    util.teardownStage(stageName);
  });

  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('yarn build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBeTruthy();

    // Create chunk manifest
    expect(shell.test('-f', 'build/chunks.json')).toBeTruthy();

    // Create server.js
    expect(shell.test('-f', 'build/server.js')).toBeTruthy();
    expect(shell.test('-f', 'build/server.js.map')).toBeTruthy();

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom .babelrc', () => {
    util.setupStageWithFixture(stageName, 'build-with-babelrc');
    const output = shell.exec('yarn build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBeTruthy();

    // Create chunk manifest
    expect(shell.test('-f', 'build/chunks.json')).toBeTruthy();

    // Create server.js
    expect(shell.test('-f', 'build/server.js')).toBeTruthy();
    expect(shell.test('-f', 'build/server.js.map')).toBeTruthy();

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom razzle.config.js', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-config');
    const output = shell.exec('yarn build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBeTruthy();

    // Create chunk manifest
    expect(shell.test('-f', 'build/chunks.json')).toBeTruthy();

    // We modify the default server output filename -> custom.js
    expect(shell.test('-f', 'build/custom.js')).toBeTruthy();
    expect(shell.test('-f', 'build/custom.js.map')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files in spa mode', () => {
    util.setupStageWithFixture(stageName, 'build-default-spa');
    const output = shell.exec('yarn build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBeTruthy();

    // Create chunk manifest
    expect(shell.test('-f', 'build/chunks.json')).toBeTruthy();

    // Create index.html
    expect(shell.test('-f', 'build/public/index.html')).toBeTruthy();

    // SHOULD NOT Create server.js
    expect(shell.test('-f', 'build/server.js')).toBeFalsy();
    expect(shell.test('-f', 'build/server.js.map')).toBeFalsy();

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBeTruthy();

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBeTruthy();
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBeTruthy();
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBeTruthy();
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

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
