'use strict';

const loaderFinder = loaderName => rule => {
  // i.e.: /eslint-loader/
  const loaderRegex = new RegExp(`[/\\\\]${loaderName}[/\\\\]`);

  // Checks if there is an object inside rule.use with loader matching loaderRegex, OR
  // If there's a loader string in rule.loader matching loaderRegex.
  return (
    (Array.isArray(rule.use) &&
      rule.use.find(
        loader =>
          typeof loader.loader === 'string' && loader.loader.match(loaderRegex)
      )) ||
    (typeof rule.loader === 'string' && rule.loader.match(loaderRegex))
  );
};

const eslintLoaderFinder = loaderFinder('eslint-loader');
const babelLoaderFinder = loaderFinder('babel-loader');
const tslintLoaderFinder = loaderFinder('tslint-loader');
const tsLoaderFinder = loaderFinder('ts-loader');

module.exports = {
  eslintLoaderFinder,
  babelLoaderFinder,
  tslintLoaderFinder,
  tsLoaderFinder,
};
