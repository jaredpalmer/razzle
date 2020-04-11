'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const StartServerPlugin = require('start-server-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const runPlugin = require('./runPlugin');
const getClientEnv = require('./env').getClientEnv;
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const ManifestPlugin = require('webpack-manifest-plugin');
const modules = require('./modules');
const logger = require('razzle-dev-utils/logger');
const defaultPaths = require('../config/paths');

const postCssOptions = {
  ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
  plugins: () => [
    require('postcss-flexbugs-fixes'),
    require('postcss-preset-env')({
      autoprefixer: {
        flexbox: 'no-2009',
      },
      stage: 3,
    }),
  ],
};

// This is the Webpack configuration factory. It's the juice!
module.exports = (
  target = 'web',
  env = 'dev',
  razzle,
  webpackObject,
  clientOnly = false
) => {
  // Define some useful shorthands.
  const IS_NODE = target === 'node';
  const IS_WEB = target === 'web';
  const IS_PROD = env === 'prod';
  const IS_DEV = env === 'dev';
  process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

  // Load razzle plugins, if they are present in razzle.config.js
  const loadedPlugins = Array.isArray(razzle.plugins)
    ? loadPlugins(razzle.plugins)
    : [];

  // Allow overriding paths
  let paths = defaultPaths;

  // Apply modifyPaths razzle plugins
  loadedPlugins.forEach(plugin => {
    paths = runPlugin(
      plugin,
      paths,
      { target, dev: IS_DEV },
      {},
      {},
      'modifyPaths'
    );
  });

  // Check if razzle.config has a modifyPaths function. If it does, call it on the
  // paths we created.
  paths = razzle.modifyPaths
    ? razzle.modifyPaths({ target, dev: IS_DEV }, paths)
    : paths;

  let configOptions = {};

  // First we check to see if the user has a custom .babelrc file, otherwise
  // we just use babel-preset-razzle.
  const hasBabelRc = fs.existsSync(paths.appBabelRc);
  configOptions.mainBabelOptions = {
    babelrc: true,
    cacheDirectory: true,
    presets: [],
  };

  if (!hasBabelRc) {
    configOptions.mainBabelOptions.presets.push(require.resolve('../babel'));
  }

  // Allow app to override babel options
  configOptions.babelOptions = razzle.modifyBabelOptions
    ? razzle.modifyBabelOptions(configOptions.mainBabelOptions, {
        target,
        dev: IS_DEV,
      })
    : configOptions.mainBabelOptions;

  if (hasBabelRc && configOptions.babelOptions.babelrc) {
    console.log('Using .babelrc defined in your app root');
  }

  const dotenv = getClientEnv(target, {
    clearConsole: razzle.clearConsole,
    host: razzle.host,
    port: razzle.port,
  });

  const portOffset = clientOnly ? 0 : 1;

  const devServerPort =
    (process.env.PORT && parseInt(process.env.PORT) + portOffset) ||
    3000 + portOffset;

  // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
  const clientPublicPath =
    dotenv.raw.CLIENT_PUBLIC_PATH ||
    (IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/');

  configOptions.context = process.cwd();

  configOptions.staticPrefix = 'static';
  configOptions.mediaPrefix = 'static/media';

  configOptions.fileLoaderExclude = [
    /\.html$/,
    /\.(js|jsx|mjs)$/,
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
  ];

  configOptions.urlLoaderTest = [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/];

  if (IS_NODE) {
    configOptions.nodeExternalsWhitelist = [
      IS_DEV ? 'webpack/hot/poll?300' : null,
      /\.(eot|woff|woff2|ttf|otf)$/,
      /\.(svg|png|jpg|jpeg|gif|ico)$/,
      /\.(mp4|mp3|ogg|swf|webp)$/,
      /\.(css|scss|sass|sss|less)$/,
    ].filter(x => x);

    if (IS_DEV) {
      configOptions.watchIgnorePaths = [
        paths.appAssetsManifest,
        paths.appChunksManifest,
      ];
    }
  }

  // Apply modifyOptions razzle plugins
  loadedPlugins.forEach(plugin => {
    configOptions = runPlugin(
      plugin,
      configOptions,
      { target, dev: IS_DEV },
      paths,
      {},
      'modifyOptions'
    );
  });

  // Check if razzle.config has a modifyOptions function. If it does, call it on the
  // configOptions we created.
  configOptions = razzle.modifyOptions
    ? razzle.modifyOptionsAfter({ target, dev: IS_DEV }, paths, configOptions)
    : configOptions;

  // This is our base webpack config.
  let config = {
    // Set webpack mode:
    mode: IS_DEV ? 'development' : 'production',
    // Set webpack context to the current command's directory
    context: configOptions.context,
    // Specify target (either 'node' or 'web')
    target: target,
    // Controversially, decide on sourcemaps.
    devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
    // We need to tell webpack how to resolve both Razzle's node_modules and
    // the users', so we use resolve and resolveLoader.
    resolve: {
      modules: ['node_modules', paths.appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
      extensions: ['.mjs', '.js', '.jsx', '.json'],
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
      strictExportPresence: true,
      rules: [
        // Disable require.ensure as it's not a standard language feature.
        // { parser: { requireEnsure: false } },
        // Avoid "require is not defined" errors
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
        // Transform ES6 with Babel
        {
          test: /\.(js|jsx|mjs)$/,
          include: [paths.appSrc],
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: configOptions.babelOptions,
            },
          ],
        },
        {
          exclude: configOptions.fileLoaderExclude,
          loader: require.resolve('file-loader'),
          options: {
            name: `${configOptions.mediaPrefix}/[name].[hash:8].[ext]`,
            emitFile: IS_WEB,
          },
        },
        // "url" loader works like "file" loader except that it embeds assets
        // smaller than specified limit in bytes as data URLs to avoid requests.
        // A missing `test` is equivalent to a match.
        {
          test: configOptions.urlLoaderTest,
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: `${configOptions.mediaPrefix}/[name].[hash:8].[ext]`,
            emitFile: IS_WEB,
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
          exclude: [paths.appBuild, /\.module\.css$/],
          use: IS_NODE
            ? // Style-loader does not work in Node.js without some crazy
              // magic. Luckily we just need css-loader.
              [
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
              ]
            : IS_DEV
            ? [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: false,
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ],
        },
        // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
        // using the extension .module.css
        {
          test: /\.module\.css$/,
          exclude: [paths.appBuild],
          use: IS_NODE
            ? [
                {
                  // on the server we do not need to embed the css and just want the identifier mappings
                  // https://github.com/webpack-contrib/css-loader#scope
                  loader: require.resolve('css-loader'),
                  options: {
                    onlyLocals: true,
                    importLoaders: 1,
                    modules: {
                      localIdentName: '[path]__[name]___[local]',
                    },
                  },
                },
              ]
            : IS_DEV
            ? [
                require.resolve('style-loader'),
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    modules: {
                      localIdentName: '[path]__[name]___[local]',
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ]
            : [
                MiniCssExtractPlugin.loader,
                {
                  loader: require.resolve('css-loader'),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    modules: {
                      localIdentName: '[path]__[name]___[local]',
                    },
                  },
                },
                {
                  loader: require.resolve('postcss-loader'),
                  options: postCssOptions,
                },
              ],
        },
      ],
    },
  };

  if (IS_NODE) {
    // We want to uphold node's __filename, and __dirname.
    config.node = {
      __console: false,
      __dirname: false,
      __filename: false,
    };

    // We need to tell webpack what to bundle into our Node bundle.
    config.externals = [
      nodeExternals({
        whitelist: configOptions.nodeExternalsWhitelist,
      }),
    ];

    // Specify webpack Node.js output path and filename
    config.output = {
      path: paths.appBuild,
      publicPath: clientPublicPath,
      filename: 'server.js',
      libraryTarget: 'commonjs2',
    };
    // Add some plugins...
    config.plugins = [
      // We define environment variables that can be accessed globally in our
      new webpack.DefinePlugin(dotenv.stringified),
    ];
    // in dev mode emitting one huge server file on every save is very slow
    if (IS_PROD) {
      // Prevent creating multiple chunks for the server
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1,
        })
      );
    }

    config.entry = [paths.appServerIndexJs];

    if (IS_DEV) {
      // Use watch mode
      config.watch = true;
      config.entry.unshift('webpack/hot/poll?300');

      // Pretty format server errors
      config.entry.unshift('razzle-dev-utils/prettyNodeErrors');

      const nodeArgs = ['-r', 'source-map-support/register'];

      // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
      if (process.env.INSPECT_BRK) {
        nodeArgs.push(process.env.INSPECT_BRK);
      } else if (process.env.INSPECT) {
        nodeArgs.push(process.env.INSPECT);
      }

      config.plugins = [
        ...config.plugins,
        // Add hot module replacement
        new webpack.HotModuleReplacementPlugin(),
        // Supress errors to console (we use our own logger)
        new StartServerPlugin({
          name: 'server.js',
          nodeArgs,
        }),
        // Ignore assets.json and chunks.json to avoid infinite recompile bug
        new webpack.WatchIgnorePlugin(configOptions.watchIgnorePaths),
      ];
    }
  }

  if (IS_WEB) {
    config.plugins = [
      // Output our JS and CSS files in a manifest file called assets.json
      // in the build directory.
      new AssetsPlugin({
        path: paths.appBuild,
        filename: 'assets.json',
      }),
      // Output our JS and CSS files in a manifest file called chunks.json
      // in the build directory.
      // based on https://github.com/danethurber/webpack-manifest-plugin/issues/181#issuecomment-467907737
      new ManifestPlugin({
        fileName: path.join(paths.appBuild, 'chunks.json'),
        writeToFileEmit: true,
        filter: item => item.isChunk,
        generate: (seed, files) => {
          const entrypoints = new Set();
          files.forEach(file =>
            ((file.chunk || {})._groups || []).forEach(group =>
              entrypoints.add(group)
            )
          );
          const entries = [...entrypoints];
          const entryArrayManifest = entries.reduce((acc, entry) => {
            const name =
              (entry.options || {}).name || (entry.runtimeChunk || {}).name;
            const files = []
              .concat(
                ...(entry.chunks || []).map(chunk =>
                  chunk.files.map(path => config.output.publicPath + path)
                )
              )
              .filter(Boolean);

            const cssFiles = files
              .map(item => (item.indexOf('.css') !== -1 ? item : null))
              .filter(Boolean);

            const jsFiles = files
              .map(item => (item.indexOf('.js') !== -1 ? item : null))
              .filter(Boolean);

            return name
              ? {
                  ...acc,
                  [name]: {
                    css: cssFiles,
                    js: jsFiles,
                  },
                }
              : acc;
          }, seed);
          return entryArrayManifest;
        },
      }),
    ];

    if (IS_DEV) {
      // Setup Webpack Dev Server on port 3001 and
      // specify our client entry point /client/index.js
      config.entry = {
        client: [
          require.resolve('razzle-dev-utils/webpackHotDevClient'),
          paths.appClientIndexJs,
        ],
      };

      // Configure our client bundles output. Not the public path is to 3001.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: clientPublicPath,
        pathinfo: true,
        libraryTarget: 'var',
        filename: `${configOptions.staticPrefix}/js/bundle.js`,
        chunkFilename: `${configOptions.staticPrefix}/js/[name].chunk.js`,
        devtoolModuleFilenameTemplate: info =>
          path.resolve(info.resourcePath).replace(/\\/g, '/'),
      };
      // Configure webpack-dev-server to serve our client-side bundle from
      // http://${dotenv.raw.HOST}:3001
      config.devServer = {
        disableHostCheck: true,
        clientLogLevel: 'none', // Enable gzip compression of generated files.
        compress: true, // watchContentBase: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
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
        quiet: true, // By default files from `contentBase` will not trigger a page reload.
        // Reportedly, this avoids CPU overload on some systems.
        // https://github.com/facebookincubator/create-react-app/issues/293
        watchOptions: { ignored: /node_modules/ },
        before(app) {
          // This lets us open files from the runtime error overlay.
          app.use(errorOverlayMiddleware());
        },
      };

      // Add client-only development plugins
      config.plugins = [
        ...config.plugins,
        new webpack.HotModuleReplacementPlugin({
          // set this true will break HtmlWebpackPlugin
          multiStep: !clientOnly,
        }),
        new webpack.DefinePlugin(dotenv.stringified),
      ];

      config.optimization = {
        // @todo automatic vendor bundle
        // Automatically split vendor and commons
        // https://twitter.com/wSokra/status/969633336732905474
        // splitChunks: {
        //   chunks: 'all',
        // },
        // Keep the runtime chunk seperated to enable long term caching
        // https://twitter.com/wSokra/status/969679223278505985
        // runtimeChunk: true,
      };
    } else {
      // Specify production entry point (/client/index.js)
      config.entry = {
        client: paths.appClientIndexJs,
      };

      // Specify the client output directory and paths. Notice that we have
      // changed the publiPath to just '/' from http://localhost:3001. This is because
      // we will only be using one port in production.
      config.output = {
        path: paths.appBuildPublic,
        publicPath: dotenv.raw.PUBLIC_PATH || '/',
        filename: `${configOptions.staticPrefix}/js/bundle.[chunkhash:8].js`,
        chunkFilename: `${configOptions.staticPrefix}/js/[name].[chunkhash:8].chunk.js`,
        libraryTarget: 'var',
      };

      config.plugins = [
        ...config.plugins,
        // Define production environment vars
        new webpack.DefinePlugin(dotenv.stringified),
        // Extract our CSS into files.
        new MiniCssExtractPlugin({
          filename: `${configOptions.staticPrefix}/css/bundle.[contenthash:8].css`,
          chunkFilename: `${configOptions.staticPrefix}/css/[name].[contenthash:8].chunk.css`,
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
      ];

      config.optimization = {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              parse: {
                // we want uglify-js to parse ecma 8 code. However, we don't want it
                // to apply any minfication steps that turns valid ecma 5 code
                // into invalid ecma 5 code. This is why the 'compress' and 'output'
                // sections only apply transformations that are ecma 5 safe
                // https://github.com/facebook/create-react-app/pull/4234
                ecma: 8,
              },
              compress: {
                ecma: 5,
                warnings: false,
                // Disabled because of an issue with Uglify breaking seemingly valid code:
                // https://github.com/facebook/create-react-app/issues/2376
                // Pending further investigation:
                // https://github.com/mishoo/UglifyJS2/issues/2011
                comparisons: false,
                // Disabled because of an issue with Terser breaking valid code:
                // https://github.com/facebook/create-react-app/issues/5250
                // Pending futher investigation:
                // https://github.com/terser-js/terser/issues/120
                inline: 2,
              },
              mangle: {
                safari10: true,
              },
              output: {
                ecma: 5,
                comments: false,
                // Turned on because emoji and regex is not minified properly using default
                // https://github.com/facebook/create-react-app/issues/2488
                ascii_only: true,
              },
            },
            // @todo add flag for sourcemaps
            sourceMap: true,
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              parser: safePostCssParser,
              // @todo add flag for sourcemaps
              map: {
                // `inline: false` forces the sourcemap to be output into a
                // separate file
                inline: false,
                // `annotation: true` appends the sourceMappingURL to the end of
                // the css file, helping the browser find the sourcemap
                annotation: true,
              },
            },
          }),
        ],
      };
    }

    if (clientOnly) {
      if (IS_DEV) {
        config.devServer.contentBase = paths.appPublic;
        config.devServer.watchContentBase = true;
        config.devServer.publicPath = '/';
      }

      config.plugins = [
        ...config.plugins,
        // Generates an `index.html` file with the <script> injected.
        new HtmlWebpackPlugin(
          Object.assign(
            {},
            {
              inject: true,
              template: paths.appHtml,
            },
            IS_PROD
              ? {
                  minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    keepClosingSlash: true,
                    minifyJS: true,
                    minifyCSS: true,
                    minifyURLs: true,
                  },
                }
              : {}
          )
        ),
      ];
    }
  }

  if (IS_DEV) {
    config.plugins = [
      ...config.plugins,
      new WebpackBar({
        color: target === 'web' ? '#f56be2' : '#c065f4',
        name: target === 'web' ? 'client' : 'server',
      }),
    ];
  }

  // Apply modifyConfig razzle plugins
  loadedPlugins.forEach(plugin => {
    config = runPlugin(
      plugin,
      config,
      { target, dev: IS_DEV },
      webpackObject,
      paths,
      configOptions,
      'modifyConfig'
    );
  });

  // Check if razzle.config has a modify function. If it does, call it on the
  // configs we created.
  if (razzle.modify) {
    config = razzle.modify(
      config,
      { target, dev: IS_DEV },
      webpackObject,
      paths,
      configOptions
    );
  }

  return { config, paths };
};
