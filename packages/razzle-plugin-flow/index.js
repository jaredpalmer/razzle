'use strict';

const FlowWebpackPlugin = require('flow-webpack-plugin');
const { babelLoaderFinder, eslintLoaderFinder } = require('./helpers');

function addFlowPlugin(config) {
  config.plugins.push(
    new FlowWebpackPlugin({
      failOnError: false,
      failOnErrorWatch: false,
      reportingSeverity: 'error',
      printFlowOutput: true,
      flowArgs: ['--color=always'],
      verbose: false,
    })
  );
}

function modifyBabelLoader(config) {
  // Safely locate Babel-Loader in Razzle's webpack internals
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(
      `'babel-loader' was erased from config, we need it to add a preset for Flow`
    );
  }

  babelLoader.use[0].options.presets.push(`flow`);
}

function modifyEslintLoader(config) {
  // Safely locate Eslint-Loader in Razzle's webpack internals
  const eslintLoader = config.module.rules.find(eslintLoaderFinder);
  if (!eslintLoader) {
    throw new Error(
      `'eslint-loader' was erased from config, we need it to add a preset for Flow`
    );
  }

  const eslintOptions = eslintLoader.use[0].options;
  if (!eslintOptions.plugins) {
    eslintOptions.plugins = [];
  }

  eslintOptions.plugins.push(`flowtype`);

  eslintOptions.baseConfig.extends.push(`plugin:flowtype/recommended`);
}

function modify(baseConfig) {
  const config = Object.assign({}, baseConfig);

  addFlowPlugin(config);
  modifyBabelLoader(config);
  modifyEslintLoader(config);

  return config;
}

module.exports = modify;
