'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const AssetsPlugin = require('assets-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const FriendlyErrorsPlugin = require('razzle-dev-utils/FriendlyErrorsPlugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const paths = require('./paths');
const getClientEnv = require('./env').getClientEnv;
const nodePath = require('./env').nodePath;

// This is the Webpack configuration factory. It's the juice!
module.exports = (
  target = 'web',
  env = 'dev',
  { clearConsole = true, host = 'localhost', port = 3000 }
) => {
  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-razzle.
  const hasBabelRc = fs.existsSync(paths.appBabelRc);
  const mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };

  if (hasBabelRc) {
    console.log('Using .babelrc defined in your app root');
  } else {
    mainBabelOptions.presets.push(require.resolve('../babel'));
  }

  // Define some useful shorthands.
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  const dotenv = getClientEnv(target, { clearConsole, host, port });

  const devServerPort = parseInt(dotenv.raw.PORT, 10) + 1;

  const getStyleLoaders = () => {
    const styleLoader = require.resolve('style-loader');
    const cssLoader = {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 1,
      },
    };
    const styleLoaders = [
      styleLoader,
      cssLoader,
      {
        loader: require.resolve('postcss-loader'),
        options: {
          ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
          plugins: () => [
            require('postcss-flexbugs-fixes'),
            autoprefixer({
              browsers: [
                '>1%',
                'last 4 versions',
                'Firefox ESR',
                'not ie < 9', // React doesn't support IE8 anyway
              ],
              flexbox: 'no-2009',
            }),
          ],
        },
      },
    ];

    return IS_NODE
      ? // Style-loader does not work in Node.js without some crazy
        // magic. Luckily we just need css-loader.
        [cssLoader]
      : IS_DEV
        ? styleLoaders
        : ExtractTextPlugin.extract({
            fallback: styleLoader,
            use: styleLoaders,
          });
  };

  // This is our base webpack config.
  let config = {
    // Set webpack context to the current command's directory
    context: process.cwd(),
    // Specify target (either 'node' or 'web')
    target: target,
    // Controversially, decide on sourcemaps.
    devtool: IS_PROD ? 'source-map' : 'cheap-eval-source-map',
    // We need to tell webpack how to resolve both Razzle's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      // modules: ['node_modules', paths.appNodeModules].concat(paths.nodePaths),
      modules: ['node_modules', paths.appNodeModules].concat(
        // It is guaranteed to exist because we tweak it in `env.js`
        nodePath.split(path.delimiter).filter(Boolean)
      ),
      extensions: ['.js', '.json', '.jsx'],
      alias: {
        // This is required so symlinks work during development.
        'webpack/hot/poll': require.resolve('webpack/hot/poll'),
        // Support React Native Web
        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        'react-native': 'react-native-web',
      },
    },
    resolveLoader: {
      modules: [paths.appNodeModules, paths.ownNodeModules],
    },
    module: {
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        { parser: { requireEnsure: false } },
        // Transform ES6 with Babel
        {
          test: /\.js?$/,
          loader: require.resolve('babel-loader'),
          include: [paths.appSrc],
          options: mainBabelOptions,
        },
        {
          exclude: [
            /\.html$/,
            /\.(js|jsx)$/,
            /\.(ts|tsx)$/,
            /\.(vue)$/,
            /\.(less)$/,
            /\.(re)$/,
            /\.(s?css|sass)$/,
            /\.json$/,
            /\.bmp$/,
            /\.gif$/,
            /\.jpe?g$/,
            /\.png$/,
          ],
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },

        // "postcss" loader applies autoprefixer to our CSS.
        // "css" loader resolves paths in CSS and adds assets as dependencies.
        // "style" loader turns CSS into JS modules that inject <style> tags.
        // In production, we use a plugin to extract that CSS to a file, but
        // in development "style" loader enables hot editing of CSS.
        //
        // Note: this yields the exact same CSS config as create-react-app.
        {
          test: /\.css$/,
          exclude: [paths.appBuild],
          use: getStyleLoaders(),
        },
      ],
    },
  };

  if (IS_NODE) {
    // We want to uphold node's __filename, and __dirname.
    config.node = { console: true, __filename: true, __dirname: true };

    // We need to tell webpack what to bundle into our Node bundle.
    config.externals = [
      nodeExternals({
        whitelist: [
          IS_DEV ? 'webpack/hot/poll?300' : null,
          /\.(eot|woff|woff2|ttf|otf)$/,
          /\.(svg|png|jpg|jpeg|gif|ico)$/,
          /\.(mp4|mp3|ogg|swf|webp)$/,
          /\.(css|scss|sass|sss|less)$/,
        ].filter(x => x),
      }),
    ];

    // Specify webpack Node.js output path and filename
    config.output = {
      path: paths.appBuild,
      publicPath: IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/',
      filename: 'server.js',
    };
    // Add some plugins...
    config.plugins = [
      // This makes debugging much easier as webpack will add filenames to
      // modules
      new webpack.NamedModulesPlugin(),
      // We define environment variables that can be accessed globally in our
      new webpack.DefinePlugin(dotenv.stringified),
    ];

    config.entry = [paths.appServerIndexJs];

    if (IS_DEV) {
      // Use watch mode
      config.watch = true;
      config.entry.unshift('webpack/hot/poll?300');

      config.plugins.push(
        ...[
          // Add hot module replacement
          new webpack.HotModuleReplacementPlugin(),
          // Supress errors to console (we use our own logger)
          new webpack.NoEmitOnErrorsPlugin(),
          // Automatically start the server when we are done compiling
          new StartServerPlugin('server.js'),
        ]
      );
    }
  }

  if (IS_WEB) {
    config.plugins = [
      // Again use the NamesModules to help with debugging
      new webpack.NamedModulesPlugin(),
      // Output our JS and CSS files in a manifest file called assets.json
      // in the build directory.
      new AssetsPlugin({
        path: paths.appBuild,
        filename: 'assets.json',
      }),
    ];

    config.entry = {
      client: [paths.appClientIndexJs],
    };

    if (IS_DEV) {
      // Setup Webpack Dev Server on port 3001 and
      // specify our client entry point /client/index.js
      config.entry.client.unshift(
        ...[
          require.resolve('webpack-dev-server/client') +
            `?http://${dotenv.raw.HOST}:${devServerPort}`,
          require.resolve('webpack/hot/dev-server'),
        ]
      );

      // Configure our client bundles output. Not the public path is to 3001.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: `http://${dotenv.raw.HOST}:${devServerPort}/`,
        pathinfo: true,
        filename: 'static/js/[name].js',
      };
      // Configure webpack-dev-server to serve our client-side bundle from
      // http://${dotenv.raw.HOST}:3001
      config.devServer = {
        disableHostCheck: true,
        clientLogLevel: 'none',
        // Enable gzip compression of generated files.
        compress: true,
        // watchContentBase: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: {
          // Paths with dots should still use the history fallback.
          // See https://github.com/facebookincubator/create-react-app/issues/387.
          disableDotRule: true,
        },
        host: dotenv.raw.HOST,
        hot: true,
        noInfo: true,
        overlay: false,
        port: devServerPort,
        quiet: true,
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: {
          ignored: /node_modules/,
        },
      };
      // Add client-only development plugins
      config.plugins.push(
        ...[
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin(),
          new webpack.DefinePlugin(dotenv.stringified),
        ]
      );
    } else {
      // Specify production entry point (just /client/index.js)
      config.entry = {
        client: [paths.appClientIndexJs],
      };

      // Specify the client output directory and paths. Notice that we have
      // changed the publiPath to just '/' from http://localhost:3001. This is because
      // we will only be using one port in production.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: '/',
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
      };

      config.plugins.push(
        ...[
          // Define production environment vars
          new webpack.DefinePlugin(dotenv.stringified),
          // Uglify/compress and optimize our JS for production, screw ie8 when
          // possible, React only works > ie9 anyway
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebookincubator/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
            },
            output: {
              comments: false,
            },
            sourceMap: true,
          }),
          // Extract our CSS into a files.
          new ExtractTextPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
          }),
        ]
      );
    }
  }

  if (IS_DEV) {
    config.plugins.push(
      ...[
        // Use our own FriendlyErrorsPlugin during development.
        new FriendlyErrorsPlugin({
          verbose: dotenv.raw.VERBOSE,
          target,
          onSuccessMessage: `Your application is running at http://${dotenv.raw
            .HOST}:${dotenv.raw.PORT}`,
        }),
      ]
    );
  }

  return config;
};
