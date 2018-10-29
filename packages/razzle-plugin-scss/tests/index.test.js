'use strict';

const createConfig = require('razzle/config/createConfig');

const pluginFunc = require('../index');
const {
  cssLoaderFinder,
  postCssLoaderFinder,
  resolveUrlLoaderFinder,
  sassLoaderFinder,
  styleLoaderFinder,
} = require('../helpers');

const webDevLoaderTests = [
  {
    name: 'should add style-loader',
    loaderFinder: styleLoaderFinder,
  },
  {
    name: 'should add css-loader',
    loaderFinder: cssLoaderFinder,
  },
  {
    name: 'should add postcss-loader',
    loaderFinder: postCssLoaderFinder,
  },
  {
    name: 'should add resolve-url-loader',
    loaderFinder: resolveUrlLoaderFinder,
  },
  {
    name: 'should add sass-loader',
    loaderFinder: sassLoaderFinder,
  },
];

const webProdLoaderTests = [
  {
    name: 'should not add style-loader (using mini-extract-css-plugin loader)',
    loaderFinder: styleLoaderFinder,
    status: 'falsy',
  },
  {
    name: 'should add css-loader',
    loaderFinder: cssLoaderFinder,
  },
  {
    name: 'should add postcss-loader',
    loaderFinder: postCssLoaderFinder,
  },
  {
    name: 'should add resolve-url-loader',
    loaderFinder: resolveUrlLoaderFinder,
  },
  {
    name: 'should add sass-loader',
    loaderFinder: sassLoaderFinder,
  },
];

const nodeLoaderTests = [
  {
    name: 'should not add style-loader',
    loaderFinder: styleLoaderFinder,
    status: 'falsy',
  },
  {
    name: 'should add css-loader',
    loaderFinder: cssLoaderFinder,
  },
  {
    name: 'should not add postcss-loader',
    loaderFinder: postCssLoaderFinder,
    status: 'falsy',
  },
  {
    name: 'should not add resolve-url-loader',
    loaderFinder: resolveUrlLoaderFinder,
    status: 'falsy',
  },
  {
    name: 'should not add sass-loader',
    loaderFinder: sassLoaderFinder,
    status: 'falsy',
  },
];

describe('razzle-scss-plugin', () => {
  describe('when creating web config', () => {
    describe('when environment set to development', () => {
      let config;

      beforeAll(() => {
        config = createConfig('web', 'dev', {
          plugins: [{ func: pluginFunc }],
        });
      });

      webDevLoaderTests.forEach(test => {
        if (test.status === 'falsy') {
          it(test.name, () => {
            expect(config.module.rules.find(test.loaderFinder)).toBeUndefined();
          });
        } else {
          it(test.name, () => {
            expect(
              config.module.rules.find(test.loaderFinder)
            ).not.toBeUndefined();
          });
        }
      });
    });

    describe('when environment set to production', () => {
      let config;

      beforeAll(() => {
        config = createConfig('web', 'prod', {
          plugins: [{ func: pluginFunc }],
        });
      });

      webProdLoaderTests.forEach(test => {
        if (test.status === 'falsy') {
          it(test.name, () => {
            expect(config.module.rules.find(test.loaderFinder)).toBeUndefined();
          });
        } else {
          it(test.name, () => {
            expect(
              config.module.rules.find(test.loaderFinder)
            ).not.toBeUndefined();
          });
        }
      });
    });
  });

  describe('when creating a node config', () => {
    let config;

    beforeAll(() => {
      config = createConfig('node', 'prod', {
        plugins: [{ func: pluginFunc }],
      });
    });

    nodeLoaderTests.forEach(test => {
      if (test.status === 'falsy') {
        it(test.name, () => {
          expect(config.module.rules.find(test.loaderFinder)).toBeUndefined();
        });
      } else {
        it(test.name, () => {
          expect(
            config.module.rules.find(test.loaderFinder)
          ).not.toBeUndefined();
        });
      }
    });
  });
});
