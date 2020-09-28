'use strict';

const createRazzleTestConfig = require('razzle/config/createRazzleTestConfig');

const plugin = require('../index');
const {
  cssLoaderFinder,
  postCssLoaderFinder,
  resolveUrlLoaderFinder,
  lessLoaderFinder,
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
    name: 'should add less-loader',
    loaderFinder: lessLoaderFinder,
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
    name: 'should add less-loader',
    loaderFinder: lessLoaderFinder,
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
    name: 'should add postcss-loader',
    loaderFinder: postCssLoaderFinder,
  },
  {
    name: 'should add resolve-url-loader',
    loaderFinder: resolveUrlLoaderFinder,
  },
  {
    name: 'should add less-loader',
    loaderFinder: lessLoaderFinder,
  },
];

describe('razzle-less-plugin', () => {
  describe('when creating web config', () => {
    describe('when environment set to development', () => {
      let config;

      beforeAll(async () => {
        config = await createRazzleTestConfig('web', 'dev', {
          plugins: [{ object: plugin }],
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

      beforeAll(async () => {
        config = await createRazzleTestConfig('web', 'prod', {
          plugins: [{ object: plugin }],
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

    beforeAll(async () => {
      config = await createRazzleTestConfig('node', 'prod', {
        plugins: [{ object: plugin }],
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
