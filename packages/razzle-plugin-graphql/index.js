'use strict';

module.exports = {
  modifyWebpackOptions(opts) {
    const options = Object.assign({}, opts.options.webpackOptions);    // Add .graphql to exlude
    options.fileLoaderExlude = [/\.graphql|gql?$/, ...options.fileLoaderExlude];
    return options;
  },
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);

      const graphqlLoader = {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: ['graphql-tag/loader']
      };

      config.module.rules = [
        ...config.module.rules,
        graphqlLoader
      ];

    return config;
  },
};
