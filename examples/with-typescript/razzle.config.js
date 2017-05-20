'use strict';

const {
  CheckerPlugin,
  TsConfigPathsPlugin,
} = require('awesome-typescript-loader');

module.exports = {
  modify(config, { target, dev }, webpack) {
    config.resolve.extensions = config.resolve.extensions.concat([
      '.ts',
      '.tsx',
    ]);

    config.devtool = 'cheap-module-source-map';

    // We don't need/want Babel anymore, so we replace it with awesome-typescript-loader!
    // Note this results in 3-5x HMR speed boost.
    config.module.rules[
      config.module.rules.findIndex(rule => rule.loader == 'babel-loader')
    ] = {
      test: /\.tsx?$/,
      use: 'awesome-typescript-loader',
    };

    config.plugins.push(new CheckerPlugin());
    config.plugins.push(new TsConfigPathsPlugin());

    return config;
  },
};
