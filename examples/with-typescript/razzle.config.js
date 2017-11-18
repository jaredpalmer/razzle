'use strict';

module.exports = {
  modify(baseConfig, { target, dev }, webpack) {
    const config = Object.assign({}, baseConfig);

    config.resolve.extensions = config.resolve.extensions.concat([
      '.ts',
      '.tsx',
    ]);

    config.devtool = 'cheap-module-source-map';

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = config.module.rules.findIndex(
      rule => rule.options && rule.options.babelrc
    );

    // Get the correct `include` option, since that hasn't changed.
    // This tells Razzle which directories to transform.
    const { include } = config.module.rules[babelLoader];

    // Declare our TypeScript loader configuration
    const tsLoader = {
      include,
      test: /\.tsx?$/,
      loader: 'ts-loader',
      options: {
        // this will make errors clickable in `Problems` tab of VSCode
        visualStudioErrorFormat: true,
      },
    };

    // const tslintLoader = {
    //   include,
    //   enforce: 'pre',
    //   test: /\.tsx?$/,
    //   loader: 'tslint-loader',
    //   options: {
    //     emitErrors: true,
    //     configFile: './tslint.json',
    //   },
    // };

    // Fully replace babel-loader with ts-loader
    config.module.rules[babelLoader] = tsLoader;
    // config.module.rules.push(tslintLoader);

    // If you want to use Babel & Typescript together (e.g. if you
    // are migrating incrementally and still need some Babel transforms)
    // then do the following:
    //
    // - COMMENT out line 42
    // - UNCOMMENT line 52
    //
    // config.module.rules.push(tsLoader)

    return config;
  },
};
