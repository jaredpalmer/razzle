'use strict';

const createRazzleTestConfig = require('razzle/config/createRazzleTestConfig');

const plugin = require('../index');
const {
  htmlLoaderFinder,
  markdownLoaderFinder,
} = require('../helpers');

const webDevLoaderTests = [  
  {
    name: 'should add html-loader',
    loaderFinder: htmlLoaderFinder,
  },
  {
    name: 'should add markdown-loader',
    loaderFinder: markdownLoaderFinder,
  }
];

const webProdLoaderTests = [
  {
    name: 'should add html-loader',
    loaderFinder: htmlLoaderFinder,
  },
  {
    name: 'should add markdown-loader',
    loaderFinder: markdownLoaderFinder,
  }
];

const nodeLoaderTests = [
  {
    name: 'should add html-loader',
    loaderFinder: htmlLoaderFinder,
  },
  {
    name: 'should add markdown-loader',
    loaderFinder: markdownLoaderFinder,
  }
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