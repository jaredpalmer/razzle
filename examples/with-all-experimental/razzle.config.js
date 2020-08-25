'use strict';

module.exports = {
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);
    if (opts.env.target === 'web' && opts.env.dev) {}
    return config;
  },
  experimental: {
    reactRefresh: true,
    newBabel: true,
    newExternals: true,
    newSplitChunks: true,
    newContentHash: true,
    newMainFields: true,
  }
};
