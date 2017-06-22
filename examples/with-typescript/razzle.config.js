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

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = config.module.rules.findIndex(
      rule => rule.options && rule.options.babelrc
    );
    console.log(babelLoader);

    // Get the correct `include` option, since that hasn't changed.
    // This tells Razzle which directories to transform.
    const { include } = config.module.rules[babelLoader];

    // Declare our TypeScript loader configuration
    const tsLoader = {
      include,
      test: /\.tsx?$/,
      use: 'awesome-typescript-loader',
    };

    // Fully replace babel-loader with aweseome-typescript-loader
    config.module.rules[babelLoader] = tsLoader;

    // If you want to use Babel & Typescript together (e.g. if you
    // are migrating incrementally and still need some Babel transforms)
    // then do the following:
    //
    // - COMMENT out line 34
    // - UNCOMMENT line 43
    //
    // config.module.rules.push(tsLoader)

    config.plugins.push(new CheckerPlugin());
    config.plugins.push(new TsConfigPathsPlugin());

    return config;
  },
};
