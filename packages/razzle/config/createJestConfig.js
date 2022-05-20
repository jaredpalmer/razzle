'use strict';

const fs = require('fs');
const clearConsole = require('react-dev-utils/clearConsole');
const logger = require('razzle-dev-utils/logger');

// first search for setupTests.ts file
// if .ts file not exists then looks for setupTests.js
function getSetupTestsFilePath(paths) {
  const path = '<rootDir>/src/setupTests';
  if (fs.existsSync(paths.tsTestsSetup)) {
    return path.concat('.ts');
  }
  if (fs.existsSync(paths.jsTestsSetup)) {
    return path.concat('.js');
  }
}

module.exports = (
  resolve,
  rootDir,
  razzle,
  razzleOptions,
  webpackObject,
  plugins,
  paths
) => {
  return new Promise(async resolveConfig => {
    // Use this instead of `paths.testsSetup` to avoid putting
    // an absolute filename into configuration after ejecting.
    const setupTestsFile = getSetupTestsFilePath(paths);

    // TODO: I don't know if it's safe or not to just use / as path separator
    // in Jest configs. We need help from somebody with Windows to determine this.
    let config =
    {
      collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],
      testMatch: [
        '<rootDir>/src/**/*(*.)@(spec|test).(ts|js)?(x)',
        '<rootDir>/src/**/__tests__/**/*(*.)@(spec|test).(ts|js)?(x)',
        '<rootDir>/tests/**/*(*.)@(spec|test).(ts|js)?(x)',
      ],
      testEnvironment: 'node',
      testURL: 'http://localhost',
      transform: {
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': resolve(
          'config/jest/babelTransform.js'
        ),
        '^.+\\.css$': resolve('config/jest/cssTransform.js'),
        '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': resolve(
          'config/jest/fileTransform.js'
        ),
      },
      transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
        '^.+\\.module\\.(css|sass|scss)$',
      ],
      moduleDirectories: ['node_modules'],
      moduleNameMapper: {
        '^react-native$': 'react-native-web',
      },
      moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
      setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : []
    }

    if (rootDir) {
      config.rootDir = rootDir;
    }

    let overrides = {};
    if (fs.existsSync(paths.appPackageJson)) {
      try {
        overrides = Object.assign({}, require(paths.appPackageJson).jest);
      } catch (e) {
        clearConsole();
        logger.error('Invalid package.json.', e);
        process.exit(1);
      }
    }

    const supportedKeys = [
      'collectCoverageFrom',
      'coverageReporters',
      'coverageThreshold',
      'globals',
      'globalSetup',
      'globalTeardown',
      'mapCoverage',
      'moduleDirectories',
      'moduleFileExtensions',
      'moduleNameMapper',
      'modulePaths',
      'snapshotSerializers',
      'setupFiles',
      'testMatch',
      'testEnvironmentOptions',
      'testResultsProcessor',
      'transform',
      'transformIgnorePatterns',
      'reporters',
      'watchPlugins',
      'setupFilesAfterEnv'
    ];
    if (overrides) {
      supportedKeys.forEach(key => {
        if (overrides.hasOwnProperty(key)) {
          config[key] = overrides[key];
          delete overrides[key];
        }
      });
    }
    for (const [plugin, pluginOptions] of plugins) {
      // Check if plugin.modifyJestConfig is a function.
      // If it is, call it on the configs we created.
      if (plugin.modifyJestConfig) {
        config = await plugin.modifyJestConfig({
          jestConfig: config,
          webpackObject: webpackObject,
          options: {
            razzleOptions,
            pluginOptions,
          },
          paths,
        });
      }
    }

    // Check if razzle.modifyJestConfig is a function.
    // If it is, call it on the configs we created.
    if (razzle.modifyJestConfig) {
      config = await razzle.modifyJestConfig({
        jestConfig: config,
        webpackObject: webpackObject,
        options: {
          razzleOptions,
        },
        paths,
      });
    }
    resolveConfig(config);
  });
};
