'use strict';

const createConfig = require('razzle/config/createConfig');
const {
  cssLoaderFinder,
  postCssLoaderFinder,
  resolveUrlLoaderFinder,
  sassLoaderFinder,
  styleLoaderFinder,
} = require('../helpers');
const pluginFunc = require('../index');

describe('razzle-scss-plugin', () => {
  describe('when creating a web config', () => {
    describe('when environment set to development', () => {
      let config;
      beforeAll(() => {
        config = createConfig('web', 'dev', {
          plugins: [{ func: pluginFunc }],
        });
      });

      it('should add style-loader', () => {
        const rule = config.module.rules.find(styleLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add css-loader', () => {
        const rule = config.module.rules.find(cssLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add postcss-loader', () => {
        const rule = config.module.rules.find(postCssLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add resolve-url-loader', () => {
        const rule = config.module.rules.find(resolveUrlLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add sass-loader', () => {
        const rule = config.module.rules.find(sassLoaderFinder);
        expect(rule).not.toBeUndefined();
      });
    });

    describe('when environment set to production', () => {
      let config;
      beforeAll(() => {
        config = createConfig('web', 'prod', {
          plugins: [{ func: pluginFunc }],
        });
      });

      it('should not add style-loader otherwise using mini-extract-css-plugin', () => {
        const rule = config.module.rules.find(styleLoaderFinder);
        expect(rule).toBeUndefined();
      });

      it('should add css-loader', () => {
        const rule = config.module.rules.find(cssLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add postcss-loader', () => {
        const rule = config.module.rules.find(postCssLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add resolve-url-loader', () => {
        const rule = config.module.rules.find(resolveUrlLoaderFinder);
        expect(rule).not.toBeUndefined();
      });

      it('should add sass-loader', () => {
        const rule = config.module.rules.find(sassLoaderFinder);
        expect(rule).not.toBeUndefined();
      });
    });
  });

  describe('when creating a server config', () => {
    // same configuration between development and production
    let config;
    beforeAll(() => {
      config = createConfig('node', 'dev', {
        plugins: [{ func: pluginFunc }],
      });
    });

    it('should not add style-loader', () => {
      const rule = config.module.rules.find(styleLoaderFinder);
      expect(rule).toBeUndefined();
    });

    it('should add css-loader', () => {
      const rule = config.module.rules.find(cssLoaderFinder);
      expect(rule).not.toBeUndefined();
    });

    it('should not add postcss-loader', () => {
      const rule = config.module.rules.find(postCssLoaderFinder);
      expect(rule).toBeUndefined();
    });

    it('should not add sass-loader', () => {
      const rule = config.module.rules.find(sassLoaderFinder);
      expect(rule).toBeUndefined();
    });
  });
});
