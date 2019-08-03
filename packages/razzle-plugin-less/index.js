'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const paths = require('razzle/config/paths');

const defaultOptions = {
  less: {
    dev: {
      sourceMap: true,
      javascriptEnabled: true,
      paths: [paths.appNodeModules],
    },
    prod: {
      sourceMap: false,
      javascriptEnabled: true,
      paths: [paths.appNodeModules],
    },
  },
  css: {
    dev: {
      sourceMap: true,
      importLoaders: 1,
    },
    prod: {
      sourceMap: false,
      importLoaders: 1,
      minimize: true,
    },
  },
  style: {},
};

module.exports = (
  defaultConfig,
  { target, dev },
  webpack,
  userOptions = {}
) => {
  const constantEnv = dev ? 'dev' : 'prod';

  const config = Object.assign({}, defaultConfig);

  const options = Object.assign({}, defaultOptions, userOptions);

  // use mini-css-extract-plugin in production
  const styleLoader = dev
    ? {
        loader: require.resolve('style-loader'),
        options: options.style,
      }
    : MiniCssExtractPlugin.loader;

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: options.css[constantEnv],
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: options.less[constantEnv],
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.less$/,
      use:
        target !== 'web'
          ? [
              {
                loader: require.resolve('css-loader/locals'),
                options: options.css,
              },
              lessLoader,
            ]
          : [styleLoader, cssLoader, lessLoader],
    },
  ];

  return config;
};
