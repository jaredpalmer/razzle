'use strict';

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
const paths = require('razzle/config/paths');

module.exports = (defaultConfig, { target, dev }) => {
  const isServer = target !== 'web';

  const config = Object.assign({}, defaultConfig);

  const postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: () => [
        PostCssFlexBugFixes,
        autoprefixer({
          browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
          flexbox: 'no-2009',
        }),
      ],
    },
  };

  const sassLoader = {
    loader: require.resolve('sass-loader'),
    options: {
      includePaths: [paths.appNodeModules],
    },
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.(sa|sc|c)ss$/,
      use: isServer
        ? [
            {
              loader: require.resolve('css-loader/locals'),
              options: {
                importLoaders: 1,
              },
            },
          ]
        : dev
          ? [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: false,
                  sourceMap: true,
                },
              },
              require.resolve('resolve-url-loader'),
              postCssLoader,
              sassLoader,
            ]
          : [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: false,
                  minimize: true,
                },
              },
              require.resolve('resolve-url-loader'),
              postCssLoader,
              sassLoader,
            ],
    },
  ];

  return config;
};
