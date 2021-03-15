'use strict';

const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const Helpers = new WebpackConfigHelpers(process.cwd());

module.exports = {
  modifyWebpackConfig(opts) {
    const config = Object.assign({}, opts.webpackConfig);

    // Add .vue to extensions
    config.resolve.extensions = [...config.resolve.extensions, '.vue'];

    // Alias ESM module
    config.resolve.alias = Object.assign({}, config.resolve.alias, {
      vue$: 'vue/dist/vue.esm.js',
    });

    // Replace the default CSS loader with Vue's
    const cssLoaderFinder = Helpers.makeLoaderFinder('css-loader');

    config.module.rules = config.module.rules.filter(
      rule => !cssLoaderFinder(rule)
    );

    config.module.rules.push({
      test: /\.vue$/,
        use: [{
        loader: require.resolve('vue-loader'),
        ident: 'razzle-vue-loader'
      }]
    });

    config.module.rules.unshift({
      test: /\.css$/,
      use: [{
          loader: require.resolve('vue-style-loader'),
          ident: 'razzle-vue-style-loader'
        }, {
          loader: require.resolve('css-loader'),
          ident: 'razzle-css-loader'
      }] // https://github.com/vuejs/vue-loader
    });

    config.plugins.push(new VueLoaderPlugin());

    return config;
  },
};
