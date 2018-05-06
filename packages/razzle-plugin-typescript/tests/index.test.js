'use strict';

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const createConfig = require('razzle/config/createConfig');
const pluginFunc = require('../index');
const {
  eslintLoaderFinder,
  babelLoaderFinder,
  tsLoaderFinder,
} = require('../helpers');

describe('razzle-typescript-plugin', () => {
  describe('without any options', () => {
    let config;
    beforeAll(() => {
      config = createConfig('web', 'dev', { plugins: [{ func: pluginFunc }] });
    });

    it('should add .ts and .tsx to extensions', () => {
      expect(config.resolve.extensions).toContain('.ts');
      expect(config.resolve.extensions).toContain('.tsx');
    });

    it('should add fork-ts-checker-webpack-plugin', () => {
      const tsCheckerPlugin = config.plugins.find(
        plugin => plugin instanceof ForkTsCheckerWebpackPlugin
      );

      expect(tsCheckerPlugin).not.toBeUndefined();
    });

    it('should add ts-loader', () => {
      const rule = config.module.rules.find(tsLoaderFinder);
      expect(rule).not.toBeUndefined();
    });
  });

  describe('with useBabel=false', () => {
    let config;
    beforeAll(() => {
      config = createConfig('web', 'dev', {
        plugins: [{ func: pluginFunc, options: { useBabel: false } }],
      });
    });

    it('should remove eslint loader', () => {
      const rule = config.module.rules.find(eslintLoaderFinder);
      expect(rule).toBeUndefined();
    });

    it('should add ts-loader', () => {
      const rule = config.module.rules.find(tsLoaderFinder);
      expect(rule).not.toBeUndefined();
    });

    it('should remove babel-loader', () => {
      const rule = config.module.rules.find(babelLoaderFinder);
      expect(rule).toBeUndefined();
    });
  });

  describe('when creating a server config', () => {
    let config;
    beforeAll(() => {
      config = createConfig('node', 'dev', {
        plugins: [{ func: pluginFunc }],
      });
    });

    it('should not add fork-ts-checker-webpack-plugin', () => {
      const tsCheckerPlugin = config.plugins.find(
        plugin => plugin instanceof ForkTsCheckerWebpackPlugin
      );

      expect(tsCheckerPlugin).toBeUndefined();
    });
  });
});
