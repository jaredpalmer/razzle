'use strict';

const FlowWebpackPlugin = require('flow-webpack-plugin');
const createConfig = require('razzle/config/createConfig');
const pluginFunc = require('../index');
const { eslintLoaderFinder, babelLoaderFinder } = require('../helpers');

// Don't allow the presence of files in this plugin repository to affect
// the tests.
jest.mock('fs-extra', () => ({ existsSync: () => false }));

describe('razzle-flow-plugin', () => {
  let config;
  beforeAll(() => {
    config = createConfig('web', 'dev', {
      plugins: [{ func: pluginFunc }],
    });
  });

  it('should add a Flow webpack plugin', () => {
    const flowPlugin = config.plugins.find(
      plugin => plugin instanceof FlowWebpackPlugin
    );

    expect(flowPlugin).not.toBeUndefined();
  });

  it('should modify babel-loader', () => {
    const rule = config.module.rules.find(babelLoaderFinder);
    expect(rule.use[0].options.presets).toContain('flow');
  });

  it('should modify eslint-loader', () => {
    const rule = config.module.rules.find(eslintLoaderFinder);
    expect(rule.use[0].options.baseConfig.extends).toContain(
      'plugin:flowtype/recommended'
    );
    expect(rule.use[0].options.plugins).toContain('flowtype');
  });
});
