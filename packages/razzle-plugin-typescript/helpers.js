'use strict';

const loaderFinder = loaderName => rule => {
  // i.e.: /eslint-loader/
  const loaderRegex = new RegExp(`[/\\\\]${loaderName}[/\\\\]`);

  // Checks if there's a loader string in rule.loader matching loaderRegex.
  const inLoaderString =
    typeof rule.loader === 'string' && rule.loader.match(loaderRegex);

  // Checks if there is an object inside rule.use with loader matching loaderRegex, OR
  const inUseArray =
    Array.isArray(rule.use) &&
    rule.use.find(
      loader =>
        typeof loader.loader === 'string' && loader.loader.match(loaderRegex)
    );

  return inUseArray || inLoaderString;
};

const babelLoaderFinder = loaderFinder('babel-loader');
const tsLoaderFinder = loaderFinder('ts-loader');
const eslintLoaderFinder = loaderFinder('eslint-loader');

module.exports = {
  eslintLoaderFinder,
  babelLoaderFinder,
  tsLoaderFinder,
};
