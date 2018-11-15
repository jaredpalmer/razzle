'use strict';

const paths = require('razzle/config/paths');

const defaultOptions = {};

module.exports = (
  defaultConfig,
  { target, dev },
  webpack,
  userOptions = {}
) => {

  const config = Object.assign({}, defaultConfig);

  const graphqlLoader = {
    test: /\.(graphql|gql)$/,
    exclude: /node_modules/,
    use: ['graphql-tag/loader']
  };

  config.module.rules = [
    ...config.module.rules,
    graphqlLoader
  ];

  return rewireFileLoader(config)
};

function rewireFileLoader(config) {
  //Exclude .graphql files from the file-loader
  config.module.rules
    .find(conf => conf.loader && conf.loader.includes('file-loader'))
    .exclude.push(/\.(graphql|gql)/);

    return config;
}