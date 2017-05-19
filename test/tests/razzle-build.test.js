const shell = require('shelljs');
const util = require('../fixtures/util');

shell.config.silent = true;

const stageName = 'stage-build';

describe('razzle build', () => {
  it('should compile files into a build directory', () => {
    util.setupStageWithFixture(stageName, 'build-default');
    const output = shell.exec('yarn build');
    expect(shell.test('-f', 'build/assets.json')).toBe(true);
    expect(shell.test('-f', 'build/server.js')).toBe(true);

    // Should copy static assets from src/public directory
    expect(shell.test('-f', 'build/public/nothing.txt')).toBe(true);

    // Should compile client bundle to js directory
    expect(shell.test('-d', 'build/public/static/js')).toBe(true);

    expect(output.code).toBe(0);
  });

  it('should respect a custom BABEL_ENV', () => {
    util.setupStageWithFixture(stageName, 'build-with-custom-babelrc');
    const output = shell.exec('BABEL_ENV=custom yarn build');
    expect(output.code).toBe(0);
  });

  afterEach(() => {
    util.teardownStage(stageName);
  });
});
