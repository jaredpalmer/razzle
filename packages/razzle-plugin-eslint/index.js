'use strict';

const ESLintPlugin = require('eslint-webpack-plugin');

const eslintFormatter = require('react-dev-utils/eslintFormatter');

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    const mainEslintOptions = {
      extensions: ['js','mjs','jsx','ts','tsx'],
      baseConfig: {
        extends: [require.resolve('eslint-config-react-app')],
      },
      formatter: eslintFormatter,
      eslintPath: require.resolve('eslint'),
      ignore: false,
      useEslintrc: true
    };

    config.plugins = [
      new ESLintPlugin(mainEslintOptions),
      ...config.plugins,
    ];
    return config;
  },
};
