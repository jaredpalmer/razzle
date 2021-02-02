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


      webpackConfig.output.library = 'RAZZLEAPP';
      webpackConfig.output.libraryTarget = 'var';
      webpackConfig.target = 'node14';
      webpackConfig.resolve.mainFields = ['main', 'module'];
      webpackConfig.resolve.extensions= ['.ts', '.tsx', '.js'];
      webpackConfig.plugins.push({
        apply: (compiler) => {
          const esmExports = `export default RAZZLEAPP;`;
          const esmExportsn = ``;
          const fakeRequire = `const require = (what) => { return import(what); }`;
          compiler.hooks.thisCompilation.tap('AddESMExports', compilation => {
            compilation.hooks.processAssets.tap({ name: 'AddESMExports', stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS }, chunks => {
              Object.keys(chunks).forEach(fileName => {
                compilation.updateAsset(fileName, content => new compiler.webpack.sources.ConcatSource(fakeRequire, '\n', content, '\n', esmExportsn));
              });
            });
          });
        }
      });
      webpackConfig.optimization.minimize = false;
      // webpackConfig.output.environment = {
      //   module: true,
      //   dynamicImport: true,
      // };
      // webpackConfig.experiments = {
      //   outputModule: true
      // };
      // webpackConfig.output.module = true;
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
    webpackOptions.jsOutputFilename = `[name].mjs`;
    webpackOptions.jsOutputChunkFilename = `[name].chunk.mjs`;
    // //webpackOptions.terserPluginOptions.terserOptions.compress.ecma = 6;
    return webpackOptions;
  },
  plugins: [{name:'typescript'}]
};
