'use strict';

const makeLoaderFinder = loaderName => rule => {
  // i.e.: /eslint-loader/
  const loaderRegex = new RegExp(`[/\\\\]${loaderName}[/\\\\]`);

  // Checks if there's a loader string in rule.loader matching loaderRegex.
  const inLoaderString =
    typeof rule.loader === 'string' && (rule.loader.match(loaderRegex) || rule.loader === loaderName);

  // Checks if there is an object inside rule.use with loader matching loaderRegex, OR
  // Checks another condition, if rule is not an object, but pure string (ex: "style-loader", etc)
  const inUseArray =
    Array.isArray(rule.use) &&
    rule.use.find(
      loader =>
        (typeof loader.loader === 'string' &&
          (loader.loader.match(loaderRegex)) || rule.loader === loaderName) ||
        (typeof loader === 'string' && (loader.match(loaderRegex) || loader === loaderName))
    );

  return inUseArray || inLoaderString;
};

module.exports = makeLoaderFinder;
