'use strict';

const eslintLoaderFinder = rule =>
  Array.isArray(rule.use) &&
  rule.use.find(
    loader =>
      typeof loader.loader === 'string' &&
      loader.loader.match(/[/\\]eslint-loader[/\\]/)
  );

const babelLoaderFinder = rule =>
  Array.isArray(rule.use) &&
  rule.use.find(
    loader =>
      typeof loader.loader === 'string' &&
      loader.loader.match(/[/\\]babel-loader[/\\]/)
  );

const tslintLoaderFinder = rule =>
  typeof rule.loader === 'string' &&
  rule.loader.match(/[/\\]tslint-loader[/\\]/);

const tsLoaderFinder = rule =>
  Array.isArray(rule.use) &&
  rule.use.find(
    loader =>
      typeof loader.loader === 'string' &&
      loader.loader.match(/[/\\]ts-loader[/\\]/)
  );

module.exports = {
  eslintLoaderFinder,
  babelLoaderFinder,
  tslintLoaderFinder,
  tsLoaderFinder,
};
