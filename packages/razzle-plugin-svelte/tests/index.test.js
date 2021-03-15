'use strict';

const createRazzleTestConfig = require('razzle/config/createRazzleTestConfig');
const plugin = require('../index');
const { svelteLoaderFinder, fileLoaderFinder } = require('../helpers');

describe('razzle-svelte-plugin', () => {
  let config;
  beforeAll(async () => {
    config = await createRazzleTestConfig('web', 'dev', {
      plugins: [{ object: plugin }],
    });
    console.log(config);
  });

  it('should add .svelte', () => {
    expect(config.resolve.extensions).toContain('.svelte');
  });

  it('should add svelte-loader', () => {
    const rule = config.module.rules.find(svelteLoaderFinder);
    expect(rule).not.toBeUndefined();
  });

  it('should add svelte format to exclude', () => {
    const fileRule = config.module.rules.find(fileLoaderFinder);
    expect(fileRule.exclude).toContainEqual(/\.svelte?$/);
  });
});
