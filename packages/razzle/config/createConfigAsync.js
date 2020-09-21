'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const crypto = require('crypto');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const StartServerPlugin = require('@fivethreeo/start-server-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const getClientEnv = require('./env').getClientEnv;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const modules = require('./modules');
const postcssLoadConfig = require('postcss-load-config');
const resolveRequest = require('razzle-dev-utils/resolveRequest');
const logger = require('razzle-dev-utils/logger');
const razzlePaths = require('razzle/config/paths');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const webpackMajor = require('razzle-dev-utils/webpackMajor');

const hasPostCssConfigTest = () => {
  try {
    return !!postcssLoadConfig.sync();
  } catch (_error) {
    return false;
  }
};

const hasPostCssConfig = hasPostCssConfigTest();

const webpackDevClientEntry = require.resolve(
  'razzle-dev-utils/webpackHotDevClient'
);

const isModuleCSS = module => {
  return (
    // mini-css-extract-plugin
    module.type === `css/mini-extract` ||
    // extract-css-chunks-webpack-plugin (old)
    module.type === `css/extract-chunks` ||
    // extract-css-chunks-webpack-plugin (new)
    module.type === `css/extract-css-chunks`
  );
};

// This is the Webpack configuration factory. It's the juice!
module.exports = (
  target = 'web',
  env = 'dev',
  {
    clearConsole = true,
    host = 'localhost',
    port = 3000,
    modify = null,
    modifyWebpackOptions = null,
    modifyWebpackConfig = null,
    modifyBabelOptions = null,
    experimental = {},
    disableStartServer = false,
  },
  webpackObject,
  clientOnly = false,
  paths = razzlePaths,
  plugins = [],
  razzleOptions = {}
) => {
  return new Promise(async resolve => {
    // Define some useful shorthands.
    const IS_NODE = target === 'node';
    const IS_WEB = target === 'web';
    const IS_PROD = env === 'prod';
    const IS_DEV = env === 'dev';
    process.env.NODE_ENV = IS_PROD ? 'production' : 'development';

    // Contains various versions of the Webpack SplitChunksPlugin used in different build types
    const splitChunksConfigs = {
      dev: {
        cacheGroups: {
          default: false,
          vendors: false,
          // In webpack 5 vendors was renamed to defaultVendors
          defaultVendors: false,
        },
      },
      prodGranular: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // In webpack 5 vendors was renamed to defaultVendors
          defaultVendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            // This regex ignores nested copies of framework libraries so they're
            // bundled with their issuer.
            // https://github.com/vercel/next.js/pull/9012
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            // Don't let webpack eliminate this chunk (prevents this chunk from
            // becoming a part of the commons chunk)
            enforce: true,
          },
          lib: {
            test: module => {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.identifier())
              );
            },
            name: module => {
              const hash = crypto.createHash('sha1');
              if (isModuleCSS(module)) {
                module.updateHash(hash);
              } else {
                if (!module.libIdent) {
                  throw new Error(
                    `Encountered unknown module type: ${module.type}. Please open an issue.`
                  );
                }

                hash.update(module.libIdent({ context: paths.appPath }));
              }

              return hash.digest('hex').substring(0, 8);
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // commons: {
          //   name: 'commons',
          //   minChunks: totalPages,
          //   priority: 20,
          // },
          shared: {
            name(module, chunks) {
              return (
                crypto
                  .createHash('sha1')
                  .update(
                    chunks.reduce((acc, chunk) => {
                      return acc + chunk.name;
                    }, '')
                  )
                  .digest('hex') + (isModuleCSS(module) ? '_CSS' : '')
              );
            },
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      },
    };

    const shouldUseReactRefresh =
      IS_WEB && IS_DEV && razzleOptions.useReactRefresh ? true : false;

    let webpackOptions = {};

    const hasStaticExportJs = fs.existsSync(paths.appStaticExportJs + '.js');

    const dotenv = getClientEnv(
      target,
      { clearConsole, host, port, shouldUseReactRefresh },
      paths
    );

    const portOffset = clientOnly ? 0 : 1;

    const devServerPort =
      (process.env.PORT_DEV && parseInt(process.env.PORT_DEV)) ||
      (process.env.PORT && parseInt(process.env.PORT) + portOffset) ||
      3000 + portOffset;

    // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
    const clientPublicPath =
      dotenv.raw.CLIENT_PUBLIC_PATH ||
      (IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/');

    const modulesConfig = modules(paths);
    const additionalModulePaths = modulesConfig.additionalModulePaths || [];
    const additionalAliases = modulesConfig.additionalAliases || {};
    const additionalIncludes = modulesConfig.additionalIncludes || [];

    const nodeExternalsFunc = (context, request, callback) => {
      if (
        (razzleOptions.notExternalModules || []).indexOf(
          request
        ) !== -1
      ) {
        return callback();
      }

      const isLocal =
      request.startsWith('.') ||
      // Always check for unix-style path, as webpack sometimes
      // normalizes as posix.
      path.posix.isAbsolute(request) ||
      // When on Windows, we also want to check for Windows-specific
      // absolute paths.
      (process.platform === 'win32' && path.win32.isAbsolute(request));

      // Relative requires don't need custom resolution, because they
      // are relative to requests we've already resolved here.
      // Absolute requires (require('/foo')) are extremely uncommon, but
      // also have no need for customization as they're already resolved.
      if (isLocal) {
        return callback();
      }

      let res;
      try {
        res = resolveRequest(request, `${context}/`);
      } catch (err) {
        // If the request cannot be resolved, we need to tell webpack to
        // "bundle" it so that webpack shows an error (that it cannot be
        // resolved).
        return callback();
      }
      // Same as above, if the request cannot be resolved we need to have
      // webpack "bundle" it so it surfaces the not found error.
      if (!res) {
        return callback();
      }
      // This means we need to make sure its request resolves to the same
      // package that'll be available at runtime. If it's not identical,
      // we need to bundle the code (even if it _should_ be external).
      let baseRes = null;
      try {
        baseRes = resolveRequest(request, `${paths.appPath}/`);
      } catch (err) {
        baseRes = null;
      }

      // Same as above: if the package, when required from the root,
      // would be different from what the real resolution would use, we
      // cannot externalize it.
      if (baseRes !== res) {
        return callback();
      }

      // This is the @babel/plugin-transform-runtime "helpers: true" option
      if (res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/)) {
        return callback();
      }

      // Anything else that is standard JavaScript within `node_modules`
      // can be externalized.
      if (res.match(/node_modules[/\\].*\.js$/)) {
        const externalRequest = path.posix.join(
          paths.appPath,
          path
          .relative(paths.appPath, res)
          // Windows path normalization
          .replace(/\\/g, '/')
        );
        return callback(undefined, `commonjs ${externalRequest}`);
      }

      // Default behavior: bundle the code!
      return callback();
    };

    webpackOptions.fileLoaderExlude = [
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

    webpackOptions.urlLoaderTest = [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/];

    webpackOptions.definePluginOptions = dotenv.stringified;

    if (IS_NODE) {
      if (IS_DEV) {
      } else {
      }
    }

    if (IS_WEB) {
      if (IS_DEV) {
        webpackOptions.splitChunksConfig = splitChunksConfigs.dev;
      } else {
        webpackOptions.splitChunksConfig = splitChunksConfigs.prodGranular;
        webpackOptions.terserPluginOptions = {
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
        };
      }
    }

    if (clientOnly) {
      webpackOptions.htmlWebpackPluginOptions = Object.assign(
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
      );
    }

    webpackOptions.browserslist = razzleOptions.browserslist;

    webpackOptions.babelRule = {
      test: /\.(js|jsx|mjs|ts|tsx)$/,
      include: [paths.appSrc].concat(additionalIncludes),
      use: [{
        loader: require.resolve('./babel-loader/razzle-babel-loader'),
        options: {
          isServer: IS_NODE,
          cwd: paths.appPath,
          cache: true,
          babelPresetPlugins: razzleOptions.babelPresetPlugins || [],
          hasModern: !!razzleOptions.modern,
          development: IS_DEV,
          hasReactRefresh: shouldUseReactRefresh,
        },
      }
    ]
  };

  for (const [plugin, pluginOptions] of plugins) {
      // Check if .modifyWebpackConfig is a function.
      // If it is, call it on the configs we created.
      if (plugin.modifyWebpackOptions) {
        webpackOptions = await plugin.modifyWebpackOptions({
          env: { target, dev: IS_DEV },
          webpackObject: webpackObject,
          options: {
            pluginOptions,
            razzleOptions,
            webpackOptions,
          },
          paths,
        });
      }
    }
    // Check if razzle.config.js has a modifyWebpackOptions function.
    // If it does, call it on the configs we created.
    if (modifyWebpackOptions) {
      webpackOptions = await modifyWebpackOptions({
        env: { target, dev: IS_DEV },
        webpackObject: webpackObject,
        options: {
          razzleOptions,
          webpackOptions,
        },
        paths,
      });
    }

    const defaultPostCssOptions = {
      ident: 'postcss',
      plugins: [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            overrideBrowserslist: webpackOptions.browserslist || [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9',
            ],
            flexbox: 'no-2009',
          },
          stage: 3,
        }),
      ],
    };

    const postCssOptions = hasPostCssConfig ? undefined : { postcssOptions: defaultPostCssOptions };

    // This is our base webpack config.
    let config = {
      // Set webpack mode:
      mode: IS_DEV ? 'development' : 'production',
      // Set webpack context to the current command's directory
      context: process.cwd(),
      // Specify target (either 'node' or 'web')
      target: target,
      // Controversially, decide on sourcemaps.
      devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
      // We need to tell webpack how to resolve both Razzle's node_modules and
      // the users', so we use resolve and resolveLoader.
      resolve: {
        mainFields: IS_NODE ? ['main', 'module']
        : ['browser', 'module', 'main'],
        modules: ['node_modules', paths.appNodeModules].concat(
          additionalModulePaths
        ),
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: Object.assign(
          {
            // This is required so symlinks work during development.
            'webpack/hot/poll': require.resolve('webpack/hot/poll'),
            // Support React Native Web
            // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
            'react-native': 'react-native-web',
          },
          additionalAliases
        ),
        plugins: [
          // TODO: Remove when using webpack 5
          PnpWebpackPlugin,
        ],
      },
      resolveLoader: {
        modules: [paths.appNodeModules, paths.ownNodeModules],
        plugins: [
          // TODO: Remove when using webpack 5
          PnpWebpackPlugin.moduleLoader(module),
        ],
      },
      module: {
        strictExportPresence: true,
        rules: [
          webpackOptions.babelRule,
          {
            exclude: webpackOptions.fileLoaderExlude,
            loader: require.resolve('file-loader'),
            options: {
              name: `${razzleOptions.mediaPrefix}/[name].[contenthash:8].[ext]`,
              emitFile: IS_WEB,
            },
          },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: webpackOptions.urlLoaderTest,
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: `${razzleOptions.mediaPrefix}/[name].[contenthash:8].[ext]`,
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
            use: IS_NODE
            ? // Style-loader does not work in Node.js without some crazy
            // magic. Luckily we just need css-loader.
            [
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: { auto: true },
                  onlyLocals: true,
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
                    auto: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]',
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
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]',
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
        __dirname: false,
        __filename: false,
      };

      // We need to tell webpack what to bundle into our Node bundle.
      config.externals = razzleOptions.buildType !== 'serverless' ? [nodeExternalsFunc] : [];

      // Specify webpack Node.js output path and filename
      config.output = {
        path: paths.appBuild,
        publicPath: clientPublicPath,
        filename: '[name].js',
        libraryTarget: 'commonjs2',
      };

      if (webpackMajor === 5) {
        config.output.library = {
          type: 'commonjs2'
        };
      }

      // Add some plugins...
      config.plugins = [
        // We define environment variables that can be accessed globally in our
        new webpack.DefinePlugin(webpackOptions.definePluginOptions),
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

      config.entry = {
        server: [paths.appServerIndexJs],
      };

      if (IS_PROD) {
        if (hasStaticExportJs) {
          config.entry.static_export = [paths.appStaticExportJs];
        }
      }

      if (IS_DEV) {
        // Use watch mode
        config.watch = true;
        config.entry.server.unshift(
          `${require.resolve('webpack/hot/poll')}?300`
        );

        // Pretty format server errors
        config.entry.server.unshift(
          require.resolve('razzle-dev-utils/prettyNodeErrors')
        );

        const nodeArgs = ['-r', require.resolve('source-map-support/register')];

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
          !disableStartServer &&
            new StartServerPlugin({
              verbose: false,
              name: 'server.js',
              entryName: 'server',
              nodeArgs,
            }),
          // Ignore assets.json and chunks.json to avoid infinite recompile bug
          new webpack.WatchIgnorePlugin(
            webpackMajor === 5
              ? { paths: [paths.appAssetsManifest, paths.appChunksManifest] }
              : [paths.appAssetsManifest, paths.appChunksManifest]
          ),
        ].filter(x => x);
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
        // Output all files in a manifest file called assets-manifest.json
        // in the build directory.
        experimental.newAssetsManifest ? new ManifestPlugin({
          fileName: path.join(paths.appBuild, 'assets-manifest.json'),
          writeToFileEmit: true,
          generate: (seed, files) => {
            const entrypoints = new Set();
            const noChunkFiles = new Set();
            files.forEach(file => {
              if (file.isChunk) {
                const groups = (
                  (file.chunk || {})._groups || []
                ).forEach(group => entrypoints.add(group));
              } else {
                noChunkFiles.add(file);
              }
            });
            const entries = [...entrypoints];
            const entryArrayManifest = entries.reduce((acc, entry) => {
              const name =
                (entry.options || {}).name ||
                (entry.runtimeChunk || {}).name ||
                entry.id;
              const files = []
                .concat(
                  ...(entry.chunks || []).map(chunk =>
                    chunk.files.map(path => config.output.publicPath + path)
                  )
                )
                .filter(Boolean);

              const filesByType = files.reduce((types, file) => {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                types[fileType] = types[fileType] || [];
                types[fileType].push(file);
                return types;
              }, {});

              return name
                ? {
                    ...acc,
                    [name]: filesByType,
                  }
                : acc;
            }, seed);
            entryArrayManifest['noentry'] = [...noChunkFiles]
              .map(file => file.path)
              .reduce((types, file) => {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                types[fileType] = types[fileType] || [];
                types[fileType].push(file);
                return types;
              }, {});
            return entryArrayManifest;
          },
        }) : null,
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
                (entry.options || {}).name ||
                (entry.runtimeChunk || {}).name ||
                entry.id;
              const files = []
                .concat(
                  ...(entry.chunks || []).map(chunk =>
                    chunk.files.map(path => config.output.publicPath + path)
                  )
                )
                .filter(Boolean);

              const chunkIds = [].concat(
                ...(entry.chunks || []).map(chunk => chunk.ids)
              );

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
                      chunks: chunkIds,
                    },
                  }
                : acc;
            }, seed);
            return entryArrayManifest;
          },
        }),
      ].filter(x=>x);

      if (IS_DEV) {
        // Setup Webpack Dev Server on port 3001 and
        // specify our client entry point /client/index.js
        config.entry = {
          client: [
            !shouldUseReactRefresh ? webpackDevClientEntry : null,
            paths.appClientIndexJs,
          ].filter(x => x),
        };

        // Configure our client bundles output. Not the public path is to 3001.
        config.output = {
          path: paths.appBuildPublic,
          publicPath: clientPublicPath,
          pathinfo: true,
          libraryTarget: 'var',
          filename: `${razzleOptions.jsPrefix}/bundle.js`,
          chunkFilename: `${razzleOptions.jsPrefix}/[name].chunk.js`,
          devtoolModuleFilenameTemplate: info =>
            path.resolve(info.resourcePath).replace(/\\/g, '/'),
        };

        if (webpackMajor === 5) {
          config.output.library = {
            type: 'var',
            name: 'client',
          };
        }

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
          shouldUseReactRefresh
            ? new ReactRefreshWebpackPlugin({
                overlay: {
                  entry: webpackDevClientEntry,
                },
              })
            : null,
          new webpack.DefinePlugin(webpackOptions.definePluginOptions),
        ].filter(x => x);

        config.optimization = {
          splitChunks: webpackOptions.splitChunksConfig,
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
          filename: `${razzleOptions.jsPrefix}/[name].[contenthash:8].js`,
          chunkFilename: `${razzleOptions.jsPrefix}/[name].[contenthash:8].chunk.js`,
          libraryTarget: 'var',
        };

        if (webpackMajor === 5) {
          config.output.library = {
            type: 'var',
            name: 'client',
          };
        }

        config.plugins = [
          ...config.plugins,
          // Define production environment vars
          new webpack.DefinePlugin(webpackOptions.definePluginOptions),
          // Extract our CSS into files.
          new MiniCssExtractPlugin({
            filename: `${razzleOptions.cssPrefix}/bundle.[contenthash:8].css`,
            chunkFilename: `${razzleOptions.cssPrefix}/[name].[contenthash:8].chunk.css`,
          }),
          webpackMajor === 5 ? null : new webpack.HashedModuleIdsPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
          new CopyPlugin([
            {
              from: paths.appPublic + '/**/*',
              to: paths.appBuild,
              context: paths.appPath,
            },
          ]),
        ].filter(x => x);

        config.optimization = {
          splitChunks: webpackOptions.splitChunksConfig,
          moduleIds: webpackMajor === 5 ? 'deterministic' : 'hashed',
          minimize: true,
          minimizer: [
            new TerserPlugin(webpackOptions.terserPluginOptions),
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
        }
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
          new HtmlWebpackPlugin(webpackOptions.htmlWebpackPluginOptions),
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

    for (const [plugin, pluginOptions] of plugins) {
      // Check if .modifyWebpackConfig is a function.
      // If it is, call it on the configs we created.
      if (plugin.modifyWebpackConfig) {
        config = await plugin.modifyWebpackConfig({
          env: { target, dev: IS_DEV },
          webpackConfig: config,
          webpackObject: webpackObject,
          options: {
            pluginOptions,
            razzleOptions,
            webpackOptions,
          },
          paths,
        });
      }
    }
    // Check if razzle.config.js has a modifyWebpackConfig function.
    // If it does, call it on the configs we created.
    if (modifyWebpackConfig) {
      config = await modifyWebpackConfig({
        env: { target, dev: IS_DEV },
        webpackConfig: config,
        webpackObject: webpackObject,
        options: {
          razzleOptions,
          webpackOptions,
        },
        paths,
      });
    }

    resolve(config);
  });
};
