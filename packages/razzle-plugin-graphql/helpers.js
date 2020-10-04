'use strict';
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder');

const gqlLoaderFinder = makeLoaderFinder('graphql-tag/loader');

module.exports = {
  gqlLoaderFinder,
};
