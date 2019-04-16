'use strict';

const eslintFormatter = require('react-dev-utils/eslintFormatter');

module.exports = function modify(config) {
  const mainEslintOptions = {
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app')],
      // This setting can be removed once this commit is released:
      // https://github.com/facebook/create-react-app/commit/005ee5b9525d476d2eb2dfb5b8afcd15b65dd5d2
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    formatter: eslintFormatter,
    eslintPath: require.resolve('eslint'),
    ignore: false,
    useEslintrc: true,
  };

  config.module.rules = [
    {
      test: /\.(js|jsx|mjs)$/,
      enforce: 'pre',
      loader: require.resolve('eslint-loader'),
      options: mainEslintOptions,
      exclude: /node_modules/,
    },
    ...config.module.rules,
  ];

  return config;
};
