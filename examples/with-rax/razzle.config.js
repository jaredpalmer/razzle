'use strict';

module.exports = {
  options: {
    verbose: true,
    enableSourceMaps: false
    // enableTargetBabelrc: true
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
  //
  // webpackConfig.resolve.alias = Object.assign(webpackConfig.resolve.alias, {
  //   'rax': 'rax/es',
  //   'rax-view': 'rax-view/es',
  //   'rax-image': 'rax-image/es',
  //   'rax-text': 'rax-text/es',
  //   'rax-button': 'rax-button/es'
  // });
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
    // webpackOptions.babelRule.include = webpackOptions.babelRule.include.concat([
    //   /rax/
    // ])
    webpackOptions.notNodeExternalResMatch = (request, context) => {
      return request.contains('rax')
    };
    return webpackOptions;
  },
};
