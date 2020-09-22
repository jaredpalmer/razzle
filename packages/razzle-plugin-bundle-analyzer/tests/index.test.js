'use strict';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const createRazzleTestConfig = require('razzle/config/createRazzleTestConfig');
const plugin = require('../index');

describe('razzle-bundle-analyzer-plugin', () => {
  describe('with default options in web development ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('web', 'dev', {
        plugins: [{ object: plugin }],
      });
      done();
    });

    it('should not add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).toBeUndefined();
    });

  });

  describe('with default options in web production ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('web', 'prod', {
        plugins: [{ object: plugin }],
      });
      done();
    });

    it('should add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).not.toBeUndefined();
    });
  });

  describe('with default options in node development ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('node', 'dev', {
        plugins: [{ object: plugin }],
      });
      done();
    });

    it('should not add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).toBeUndefined();
    });

  });

  describe('with default options in node production ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('node', 'prod', {
        plugins: [{ object: plugin }],
      });
      done();
    });

    it('should not add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).toBeUndefined();
    });
  });

  describe('with options in node development ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('node', 'dev', {
        plugins: [{ object: plugin, options: { target: 'node' } }],
      });
      done();
    });

    it('should not add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).toBeUndefined();
    });

  });

  describe('with options in node production ', () => {
    let config;
    beforeAll(async done => {
      config = await createRazzleTestConfig('node', 'prod', {
        plugins: [{ object: plugin, options: { target: 'node' } }],
      });
      done();
    });

    it('should add webpack-bundle-analyzer-plugin', () => {
      const BAPlugin = config.plugins.find(
        plugin => plugin instanceof BundleAnalyzerPlugin
      );

      expect(BAPlugin).not.toBeUndefined();
    });
  });

    describe('with options in web development ', () => {
      let config;
      beforeAll(async done => {
        config = await createRazzleTestConfig('web', 'dev', {
          plugins: [{ object: plugin, options: { env: 'development' } }],
        });
        done();
      });

      it('should add webpack-bundle-analyzer-plugin', () => {
        const BAPlugin = config.plugins.find(
          plugin => plugin instanceof BundleAnalyzerPlugin
        );

        expect(BAPlugin).not.toBeUndefined();
      });

    });

    describe('with options in web production ', () => {
      let config;
      beforeAll(async done => {
        config = await createRazzleTestConfig('web', 'prod', {
          plugins: [{ object: plugin, options: { env: 'development' } }],
        });
        done();
      });

      it('should not add webpack-bundle-analyzer-plugin', () => {
        const BAPlugin = config.plugins.find(
          plugin => plugin instanceof BundleAnalyzerPlugin
        );

        expect(BAPlugin).toBeUndefined();
      });
    });

});
