'use strict';

const autoprefixer = require('autoprefixer');
const merge = require('deepmerge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('razzle/config/paths');
const postcssLoadConfig = require('postcss-load-config');

const hasPostCssConfig = () => {
  try {
    return !!postcssLoadConfig.sync();
  } catch (_error) {
    return false;
  }
};

module.exports = {
  modifyWebpackConfig(opts) {
    const isServer = opts.env.target !== 'web';
    const constantEnv = opts.env.dev ? 'dev' : 'prod';

    const razzleOptions = opts.options.razzleOptions;
    const config = Object.assign({}, opts.webpackConfig);

    const defaultOptions = {
      postcss: {
        dev: {
          sourceMap: true,
          ident: 'postcss',
        },
        prod: {
          sourceMap: razzleOptions.enableSourceMaps,
          ident: 'postcss',
        },
        plugins: [
          [autoprefixer, {
            overrideBrowserslist: opts.options.razzleOptions.browserslist || [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9',
            ],
            flexbox: 'no-2009',
          }],
        ],
      },
      less: {
        dev: {
          sourceMap: true,
          lessOptions: {
            includePaths: [paths.appNodeModules],
          },
        },
        prod: {
          // XXX Source maps are required for the resolve-url-loader to properly
          // function. Disable them in later stages if you do not want source maps.
          sourceMap: true,
          lessOptions: {
            includePaths: [paths.appNodeModules],
          },
        },
      },
      css: {
        dev: {
          sourceMap: true,
          importLoaders: 1,
          modules: {
            auto: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
        prod: {
          sourceMap: razzleOptions.enableSourceMaps,
          importLoaders: 1,
          modules: {
            auto: true,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
      style: {},
      resolveUrl: {
        dev: {},
        prod: {},
      },
    };

    const options = Object.assign(
      {},
      defaultOptions,
      opts.options.pluginOptions
    );

    const styleLoader = {
      loader: require.resolve('style-loader'),
      options: options.style,
    };

    const cssLoader = {
      loader: require.resolve('css-loader'),
      options: options.css[constantEnv],
    };

    const resolveUrlLoader = {
      loader: require.resolve('resolve-url-loader'),
      options: options.resolveUrl[constantEnv],
    };

    const postCssLoader = {
      loader: require.resolve('postcss-loader'),
      options: hasPostCssConfig()
        ? undefined
        : { postcssOptions: Object.assign({}, options.postcss[constantEnv], {
            plugins: options.postcss.plugins,
          })},
    };

    const lessLoader = {
      loader: require.resolve('less-loader'),
      options: Object.assign({}, options.less[constantEnv]),
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.less$/,
        use: isServer
          ? [
              {
                loader: require.resolve('css-loader'),
                options: merge(options.css[constantEnv], {
                  modules: {
                    exportOnlyLocals: true,
                  }
                }),
              },
              resolveUrlLoader,
              postCssLoader,
              lessLoader,
            ]
          : [
              opts.env.dev ? styleLoader : MiniCssExtractPlugin.loader,
              cssLoader,
              postCssLoader,
              resolveUrlLoader,
              lessLoader,
            ],
      },
    ];

    return config;
  },
};
