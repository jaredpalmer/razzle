'use strict';

const eslintFormatter = require('react-dev-utils/eslintFormatter');

module.exports = {
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    const mainEslintOptions = {
      baseConfig: {
        extends: [require.resolve('eslint-config-react-app')],
      },
      formatter: eslintFormatter,
      eslintPath: require.resolve('eslint'),
      ignore: false,
      useEslintrc: true,
    };

    config.module.rules = [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        loader: require.resolve('eslint-loader'),
        options: mainEslintOptions,
        exclude: /node_modules/,
      },
      ...config.module.rules,
    ];
    return config;
  },
};
