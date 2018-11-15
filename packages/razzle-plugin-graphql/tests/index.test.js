'use strict';

const createConfig = require('razzle/config/createConfig');

const pluginFunc = require('../index');
const {
  gqlLoaderFinder
} = require('../helpers');

const webDevLoaderTests = [
  {
    name: 'should add grahpql-tag/loader',
    loaderFinder: gqlLoaderFinder,
  }
];

const webProdLoaderTests = [
  {
    name: 'should add grahpql-tag/loader',
    loaderFinder: gqlLoaderFinder,
  }
];

const nodeLoaderTests = [
  {
    name: 'should add grahpql-tag/loader',
    loaderFinder: gqlLoaderFinder,
  }
];

describe('razzle-plugin-graphql', () => {
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
