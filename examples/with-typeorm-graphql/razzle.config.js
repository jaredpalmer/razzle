'use strict';

module.exports = {
  options: {
    verbose: true,
    enableTargetBabelrc: true
  },
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    if (target === 'node') {
      //  webpackConfig.output.library = {
      //    type: 'var'
      //  };
      // webpackConfig.output.libraryTarget = 'var';
      // webpackConfig.target = 'es6';
      // webpackConfig.output.module = true;
      // webpackConfig.experiments = {
      //   outputModule: true
      // };
      // webpackConfig.optimization.minimize = false;
    }
    return webpackConfig;
  },
  modifyWebpackOptions({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that was used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    // webpackOptions.jsOutputFilename = `[name].js`;
    // webpackOptions.jsOutputChunkFilename = `[name].chunk.js`;
    // // webpackOptions.babelRule.use[0].options. = true;
    // //webpackOptions.terserPluginOptions.terserOptions.compress.ecma = 6;
    return webpackOptions;
  },
  plugins: [{name:'typescript',options: {useBabel:true}}]
};
