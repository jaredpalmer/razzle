'use strict';

module.exports = {
  modify(baseConfig, { target, dev }, webpack) {
    const config = Object.assign({}, baseConfig);

    config.resolve.extensions = config.resolve.extensions.concat([
      '.ts',
      '.tsx',
    ]);
 


    // Locate eslint-loader and remove it (we're using tslint instead)
    config.module.rules = config.module.rules.filter(
      rule =>
        !(
          Array.isArray(rule.use) &&
          rule.use.length > 0 &&
          rule.use[0].options &&
          'useEslintrc' in rule.use[0].options
        )
    );
    // Add tslint-loader
    config.module.rules.push({
      include,
      enforce: 'pre',
      test: /\.tsx?$/,
      loader: 'tslint-loader',
      options: {
        emitErrors: true,
        configFile: './tslint.json',
      },
    });

    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = config.module.rules.findIndex(
      rule => rule.use[1].options && rule.use[1].options.babelrc
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
        transpileOnly: true,
      },
    };
    // Add loader
    config.module.rules.push(tsLoader)
    
    // Additional options found at https://github.com/TypeStrong/ts-loader#faster-builds
    // Add async typechecking errors
    // config.plugins.push(new require('fork-ts-checker-webpack-plugin')())
 
    // If you want to replace Babel with typescript to fully speed up build
    // then do the following:
    //
    // - COMMENT out line 55
    // - UNCOMMENT line 62
    //
    // config.module.rules[babelLoader] = tsLoader;

    return config;
  },
};
