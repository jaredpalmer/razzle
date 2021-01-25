'use strict';

const autoprefixer = require('autoprefixer');
const merge = require('deepmerge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
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

    const config = Object.assign({}, opts.webpackConfig);

    const defaultOptions = {
      postcss: {
        dev: {
          sourceMap: true,
          ident: 'postcss',
        },
        prod: {
          sourceMap: false,
          ident: 'postcss',
        },
        plugins: [
          PostCssFlexBugFixes,
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
      sass: {
        dev: {
          sassOptions: {
            sourceMap: true,
            includePaths: [paths.appNodeModules],
          },
        },
        prod: {
          sassOptions: {
            // XXX Source maps are required for the resolve-url-loader to properly
            // function. Disable them in later stages if you do not want source maps.
            sourceMap: true,
            sourceMapContents: false,
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
          sourceMap: false,
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

    const sassLoader = {
      loader: require.resolve('sass-loader'),
      options: options.sass[constantEnv],
    };

    config.module.rules = [
      ...config.module.rules,
      {
        test: /\.(sa|sc)ss$/,
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
              sassLoader,
            ]
          : [
              opts.env.dev ? styleLoader : MiniCssExtractPlugin.loader,
              cssLoader,
              postCssLoader,
              resolveUrlLoader,
              sassLoader,
            ],
      },
    ];

    return config;
  },
};
