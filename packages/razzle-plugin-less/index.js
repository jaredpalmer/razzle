'use strict';

const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
const paths = require('razzle/config/paths');

const defaultOptions = {
  theme: {},
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
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
        flexbox: 'no-2009',
      }),
    ],
  },
  less: {
    dev: {
      sourceMap: true,
      includePaths: [paths.appNodeModules],
    },
    prod: {
      sourceMap: false,
      includePaths: [paths.appNodeModules],
    },
  },
  css: {
    dev: {
      sourceMap: true,
      importLoaders: 1,
      modules: false,
    },
    prod: {
      sourceMap: false,
      importLoaders: 1,
      modules: false,
      minimize: true,
    },
  },
  style: {},
  resolveUrl: {
    dev: {},
    prod: {},
  },
};

module.exports = (
  defaultConfig,
  { target, dev },
  webpack,
  userOptions = {}
) => {
  const isServer = target !== 'web';
  const constantEnv = dev ? 'dev' : 'prod';

  const config = Object.assign({}, defaultConfig);

  const options = Object.assign({}, defaultOptions, userOptions);

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
    options: Object.assign({}, options.postcss[constantEnv], {
      plugins: () => options.postcss.plugins,
    }),
  };

  const lessLoader = {
    loader: require.resolve('less-loader'),
    options: Object.assign({}, options.less[constantEnv], {
      modifyVars: options.theme,
    }),
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.less$/,
      use: isServer
        ? [
            {
              loader: require.resolve('css-loader/locals'),
              options: options.css[constantEnv],
            },
          ]
        : [
            dev ? styleLoader : MiniCssExtractPlugin.loader,
            cssLoader,
            resolveUrlLoader,
            postCssLoader,
            lessLoader,
          ],
    },
  ];

  return config;
};
