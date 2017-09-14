'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-build';

describe('razzle build', () => {
  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('razzle build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBe(true);

    // Create server.js
    expect(shell.test('-f', 'build/server.js')).toBe(true);
    expect(shell.test('-f', 'build/server.js.map')).toBe(true);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBe(true);
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBe(true);
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBe(true);
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom .babelrc', () => {
    util.setupStageWithFixture(stageName, 'build-with-babelrc');
    const output = shell.exec('yarn build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBe(true);

    // Create server.js
    expect(shell.test('-f', 'build/server.js')).toBe(true);
    expect(shell.test('-f', 'build/server.js.map')).toBe(true);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBe(true);
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBe(true);
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBe(true);
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  it('should compile files with a custom razzle.config.js', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-config');
    const output = shell.exec('npm run build');
    // Create asset manifest
    expect(shell.test('-f', 'build/assets.json')).toBe(true);

    // We modify the default server output filename -> custom.js
    expect(shell.test('-f', 'build/custom.js')).toBe(true);
    expect(shell.test('-f', 'build/custom.js.map')).toBe(true);

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBe(true);
    expect(shell.ls('build/public/static/js/bundle.*.js').code).toBe(0);
    expect(shell.ls('build/public/static/js/bundle.*.js.map').code).toBe(0);

    // should compile client image assets to media directory
    expect(shell.test('-d', 'build/public/static/media')).toBe(true);
    expect(shell.ls('build/public/static/media/logo.*.png').code).toBe(0);

    // should compile client css to css directory
    expect(shell.test('-d', 'build/public/static/css')).toBe(true);
    expect(shell.ls('build/public/static/css/bundle.*.css').code).toBe(0);

    expect(output.code).toBe(0);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
