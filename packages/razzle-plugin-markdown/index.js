'use strict';

module.exports = {
  modifyWebpackOptions(opts) {
    const options = Object.assign({}, opts.options.webpackOptions);
    options.fileLoaderExclude = [/\.md$/, ...options.fileLoaderExclude];
    return options;
  },
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);
    
    const htmlLoader = {
      loader: require.resolve('html-loader'),
    };

    const markdownLoader = {
      loader: require.resolve('markdown-loader'),
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.md$/,
        use: [
              htmlLoader,
              markdownLoader,
            ],
      },
    ];

    return config;
  },
};
