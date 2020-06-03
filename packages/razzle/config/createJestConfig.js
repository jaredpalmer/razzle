'use strict';

const fs = require('fs');
const chalk = require('chalk');

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
  webpackObject,
  plugins,
  paths
) => {
  return new Promise(async resolveConfig => {
    // Use this instead of `paths.testsSetup` to avoid putting
    // an absolute filename into configuration after ejecting.

    // TODO: I don't know if it's safe or not to just use / as path separator
    // in Jest configs. We need help from somebody with Windows to determine this.
    const config = {
      collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!src/**/*.d.ts'],

      setupFilesAfterEnv: setupTestsFile ? [setupTestsFile] : [],
      testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
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
    };
    if (rootDir) {
      config.rootDir = rootDir;
    }
    const overrides = Object.assign({}, require(paths.appPackageJson).jest);
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
    ];
    if (overrides) {
      supportedKeys.forEach(key => {
        if (overrides.hasOwnProperty(key)) {
          config[key] = overrides[key];
          delete overrides[key];
        }
      })
    }
    resolveConfig(config);
  });
};
