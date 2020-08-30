'use strict';

const razzleHeroku = require('razzle-heroku');

module.exports = {
  modifyWebpackConfig(opts) {
    let config = opts.webpackConfig;

    config = razzleHeroku(config, { target: opts.env.target, dev: opts.env.dev }, opts.webpackObject);

    return config;
  },
};
