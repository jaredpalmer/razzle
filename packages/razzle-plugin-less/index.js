'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('razzle/config/paths');

module.exports = (
  defaultConfig,
  { target, dev },
  webpack,
  userOptions = {}
) => {
  const config = defaultConfig;

  const defaultOptions = {
    css: {
      dev: {
        sourceMap: true,
        importLoaders: 1,
      },
      prod: {
        sourceMap: false,
        importLoaders: 1,
        minimize: true,
      }
    },
    less: {
      dev: {
        sourceMap: true,
        paths: [paths.appNodeModules],
      },
      prod: {
        sourceMap: false,
        paths: [paths.appNodeModules],
      }
    },
    style: {
      dev: {

      }
    }
  };

  // default options will overwrite with user options
  const options = Object.assign({}, defaultOptions, userOptions);

  const styleLoader = dev
    ? {
      loader: require.resolve('style-loader'),
      options: options.style.dev,
    }
    : MiniCssExtractPlugin.loader;

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: dev ?
      options.css.dev :
      options.css.prod
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: dev ?
      options.less.dev :
      options.less.prod
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.less$/,
      use:
        target === 'node'
          ? [
            {
              loader: require.resolve('css-loader/locals'),
              options: options.css,
            },
            lessLoader,
          ]
          : [
            styleLoader,
            cssLoader,
            lessLoader
          ],
    },
  ];

  return config;
};
