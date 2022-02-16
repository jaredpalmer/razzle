'use strict';

const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const crypto = require('crypto');
const util = require('util');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StartServerPlugin = require('razzle-start-server-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const getClientEnv = require('./env').getClientEnv;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const WebpackBar = require('webpackbar');
const ManifestPlugin = require('webpack-manifest-plugin').WebpackManifestPlugin;
const CopyPlugin = require('copy-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const modules = require('./modules');
const postcssLoadConfig = require('postcss-load-config');
const resolveRequest = require('razzle-dev-utils/resolveRequest');
const logger = require('razzle-dev-utils/logger');
const razzlePaths = require('./paths');
const getCacheIdentifier = require('react-dev-utils/getCacheIdentifier');
const webpackMajor = require('razzle-dev-utils/webpackMajor');
const devServerMajorVersion = require('razzle-dev-utils/devServerMajor');

const hasPostCssConfigTest = () => {
  try {
    return !!postcssLoadConfig.sync();
  } catch (_error) {
    return false;
  }
};

const hasPostCssConfig = hasPostCssConfigTest();

let webpackDevClientEntry;
if (devServerMajorVersion > 3) {
  webpackDevClientEntry = require.resolve('razzle-dev-utils/webpackHotDevClientV4');
} else {
  webpackDevClientEntry = require.resolve('razzle-dev-utils/webpackHotDevClient');
}

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
    modifyBabelPreset = null,
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
    const IS_SERVERLESS = /serverless/.test(razzleOptions.buildType);
    const IS_PROD = env === 'prod';
    const IS_DEV = env === 'dev';
    const IS_DEV_ENV = process.env.NODE_ENV === 'development';

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
      prod: {
        cacheGroups: {
          default: false,
          vendors: false,
          // In webpack 5 vendors was renamed to defaultVendors
          defaultVendors: false,
        },
      },
    };

    const shouldUseReactRefresh =
      IS_WEB && IS_DEV && razzleOptions.enableReactRefresh ? true : false;

    const shouldDisableWebpackbar =
      razzleOptions.disableWebpackbar === true || razzleOptions.disableWebpackbar === target;

    let webpackOptions = {};

    const hasPublicDir = fs.existsSync(paths.appPublic);

    const hasStaticExportJs = fs.existsSync(paths.appStaticExportJs + '.js') ||
      fs.existsSync(paths.appStaticExportJs + '.jsx') ||
      fs.existsSync(paths.appStaticExportJs + '.ts') ||
      fs.existsSync(paths.appStaticExportJs + '.tsx');

    const dotenv = getClientEnv(
      target, IS_DEV,
      { clearConsole, host, port, shouldUseReactRefresh, forceRuntimeEnvVars: razzleOptions.forceRuntimeEnvVars, webpackObject },
      paths
    );

    const portOffset = clientOnly ? 0 : 1;

    const devServerPort =
      (process.env.PORT_DEV && parseInt(process.env.PORT_DEV, 10)) ||
      (process.env.PORT && parseInt(process.env.PORT, 10) + portOffset) ||
      3000 + portOffset;

    // VMs, Docker containers might not be available at localhost:3001. CLIENT_PUBLIC_PATH can override.
    const clientPublicPath =
      dotenv.raw.CLIENT_PUBLIC_PATH ||
      (IS_DEV ? `http://${dotenv.raw.HOST}:${devServerPort}/` : '/');

    const modulesConfig = modules(paths);
    const additionalModulePaths = modulesConfig.additionalModulePaths || [];
    const additionalAliases = modulesConfig.additionalAliases || {};
    const additionalIncludes = modulesConfig.additionalIncludes || [];


    webpackOptions.fileLoaderExclude = [
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
      /\.png$/
    ];

    webpackOptions.urlLoaderTest = [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/];

    webpackOptions.fileLoaderOutputName = `${razzleOptions.mediaPrefix}/[name].[contenthash:8].[ext]`;

    webpackOptions.urlLoaderOutputName = `${razzleOptions.mediaPrefix}/[name].[contenthash:8].[ext]`;

    webpackOptions.cssTest = [/\.css(\.map)?$/];

    webpackOptions.cssOutputFilename = `${razzleOptions.cssPrefix}/[name].[contenthash:8].css`;

    webpackOptions.cssOutputChunkFilename = `${razzleOptions.cssPrefix}/[name].[contenthash:8].chunk.css`;

    webpackOptions.jsTest = [/\.js(\.map)?$/];

    webpackOptions.definePluginOptions = dotenv.stringified;

    webpackOptions.appAssetsManifestPath = paths.appAssetsManifest;

    if (IS_NODE) {

      webpackOptions.jsOutputFilename = `[name].js`;
      webpackOptions.jsOutputChunkFilename = `[name].chunk.js`;

      if (IS_DEV) {
        const nodeArgs = ['-r', require.resolve('source-map-support/register')];

        // Passthrough --inspect and --inspect-brk flags (with optional [host:port] value) to node
        if (process.env.INSPECT_BRK) {
          nodeArgs.push(process.env.INSPECT_BRK);
        } else if (process.env.INSPECT) {
          nodeArgs.push(process.env.INSPECT);
        }

        webpackOptions.startServerOptions = {
          verbose: razzleOptions.verbose,
          name: 'server.js',
          entryName: 'server',
          killOnExit: false,
          killOnError: false,
          nodeArgs,
        };
      } else {
        webpackOptions.terserPluginOptions = {};
      }
    }

    if (IS_WEB) {

      if (IS_DEV) {

        webpackOptions.jsOutputFilename = `${razzleOptions.jsPrefix}/[name].js`;
        webpackOptions.jsOutputChunkFilename = `${razzleOptions.jsPrefix}/[name].chunk.js`;

        webpackOptions.splitChunksConfig = splitChunksConfigs.dev;
      } else {

        webpackOptions.jsOutputFilename = `${razzleOptions.jsPrefix}/[name].[contenthash:8].js`;
        webpackOptions.jsOutputChunkFilename = `${razzleOptions.jsPrefix}/[name].[contenthash:8].chunk.js`;

        webpackOptions.splitChunksConfig = splitChunksConfigs.prod;
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
          sourceMap: razzleOptions.enableSourceMaps,
        };
      }
    }

    webpackOptions.enableHtmlWebpackPlugin = clientOnly;

    webpackOptions.htmlWebpackPluginOptions = Object.assign(
      {},
      {
        inject: false,
        template: paths.appHtml
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

    webpackOptions.browserslist = razzleOptions.browserslist;

    webpackOptions.babelRule = {
        test: /\.(js|jsx|mjs|ts|tsx)$/,
        include: [paths.appSrc].concat(additionalIncludes),
        use: [{
          loader: require.resolve('./babel-loader/razzle-babel-loader'),
          options: {
            verbose: razzleOptions.verbose,
            sourceMaps: razzleOptions.enableSourceMaps,
            isServer: IS_NODE,
            cwd: paths.appPath,
            cache: razzleOptions.enableBabelCache,
            configFile: razzleOptions.enableTargetBabelrc ? path.resolve(paths.appPath, `.babelrc.${target}`) : undefined,
            hasModern: false,
            development: IS_DEV,
            shouldUseReactRefresh: shouldUseReactRefresh,
          },
          ident: 'razzle-babel-loader'
        }
      ]
    };

    webpackOptions.watchIgnorePaths = [paths.appAssetsManifest];

    webpackOptions.notNodeExternalResMatch = null;

    webpackOptions.nodeExternals = [];
    webpackOptions.clientExternals = [];
    webpackOptions.clientExternals = [];

    webpackOptions.postCssOptions = {
      ident: 'postcss',
      sourceMap: razzleOptions.enableSourceMaps,
      plugins: [
        [require('autoprefixer'), {
          overrideBrowserslist: razzleOptions.browserslist || [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9',
          ],
          flexbox: 'no-2009',
        }],
      ],
    };

    webpackOptions.nullNodeCss = false;

    for (const [plugin, pluginOptions] of plugins) {
      // Check if .modifyWebpackConfig is a function.
      // If it is, call it on the configs we created.
      if (plugin.modifyWebpackOptions) {
        webpackOptions = await plugin.modifyWebpackOptions({
          env: { target, dev: IS_DEV, serverless: IS_SERVERLESS },
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
        env: { target, dev: IS_DEV, serverless: IS_SERVERLESS },
        webpackObject: webpackObject,
        options: {
          razzleOptions,
          webpackOptions,
        },
        paths,
      });
    }

    if (razzleOptions.debug.options) {
      console.log(`Printing webpack options for ${target} target`);
      console.log(util.inspect(webpackOptions, {depth: null}));
    }

    const debugNodeExternals = razzleOptions.debug.nodeExternals;

    const nodeExternalsFunc = (context, request, callback) => {
      if (webpackOptions.notNodeExternalResMatch &&
        webpackOptions.notNodeExternalResMatch(request, context)
      ) {
        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (using notNodeExternalResMatch)`);
        }
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
        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (relative require)`);
        }
        return callback();
      }

      let res;
      try {
        res = resolveRequest(request, `${context}/`);
      } catch (err) {
        // If the request cannot be resolved, we need to tell webpack to
        // "bundle" it so that webpack shows an error (that it cannot be
        // resolved).
        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (cannot resolve)`);
        }
        return callback();
      }
      // Same as above, if the request cannot be resolved we need to have
      // webpack "bundle" it so it surfaces the not found error.
      if (!res) {
        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (cannot resolve)`);
        }
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
        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (real resolution differs)`);
        }
        return callback();
      }

      // This is the @babel/plugin-transform-runtime "helpers: true" option
      if (res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/)) {
        if (debugNodeExternals) {
          console.log(`Not externalizing @babel/plugin-transform-runtime`);
        }
        return callback();
      }

      // Anything else that is standard JavaScript within `node_modules`
      // can be externalized.
      if (res.match(/node_modules[/\\].*\.c?js$/)) {
        if (debugNodeExternals) {
          console.log(`Externalizing ${request} (node_modules)`);
        }
        return callback(undefined, `commonjs ${request}`);
      }

      if (debugNodeExternals) {
        console.log(`Not externalizing ${request} (default)`);
      }
      // Default behavior: bundle the code!
      return callback();
    };

    const postCssOptions = hasPostCssConfig ? undefined : { postcssOptions: webpackOptions.postCssOptions };

    // This is our base webpack config.
    let config = {
      // Set webpack mode:
      mode: IS_DEV || IS_DEV_ENV ? 'development' : 'production',
      // Set webpack context to the current apps directory
      context: paths.appPath,
      // Specify target (either 'node' or 'web')
      target: target,
      // Controversially, decide on sourcemaps.
      devtool: IS_DEV || IS_DEV_ENV ? 'cheap-module-source-map' : razzleOptions.enableSourceMaps ? 'source-map' : false,
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
          webpackMajor !== 5 && PnpWebpackPlugin,
        ].filter(x => x),
      },
      resolveLoader: {
        modules: [paths.appNodeModules, paths.ownNodeModules],
        plugins: [
          webpackMajor !== 5 && PnpWebpackPlugin.moduleLoader(module),
        ].filter(x => x),
      },
      module: {
        strictExportPresence: true,
        rules: [
          webpackOptions.babelRule,
          {
            exclude: webpackOptions.fileLoaderExclude,
            use: clientOnly || webpackOptions.enableHtmlWebpackPlugin ? (info) => {
              return info.compiler !== 'HtmlWebpackCompiler' ? [{
                loader: require.resolve('file-loader'),
                options: {
                  name: webpackOptions.fileLoaderOutputName,
                  emitFile: IS_WEB,
                },
                ident: 'razzle-file-loader'
              }]:[]} :
              [{ // fix for vue-loader plugin
                loader: require.resolve('file-loader'),
                options: {
                  name: webpackOptions.fileLoaderOutputName,
                  emitFile: IS_WEB,
                },
                ident: 'razzle-file-loader'
              }]
            },
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: webpackOptions.urlLoaderTest,
            use: [{
              loader: require.resolve('url-loader'),
              options: {
                limit: 10000,
                name: webpackOptions.urlLoaderOutputName,
                emitFile: IS_WEB,
              },
              ident: 'razzle-url-loader'
            }
          ]},

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
              webpackOptions.nullNodeCss ? {
                loader: require.resolve('null-loader')
              } : {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    exportOnlyLocals: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                  },
                },
                ident: 'razzle-css-loader'
              },
            ]
            : IS_DEV
            ? [
              razzleOptions.staticCssInDev
                ?  {
                  loader: MiniCssExtractPlugin.loader,
                  ident: 'razzle-mini-css-extract-loader'
                } : {
                  loader: require.resolve('style-loader'),
                  ident: 'razzle-style-loader'
                },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                },
                ident: 'razzle-css-loader'
              },
              {
                loader: require.resolve('postcss-loader'),
                options: postCssOptions,
                ident: 'razzle-postcss-loader'
              },
            ]
            : [{
                loader: MiniCssExtractPlugin.loader,
                ident: 'razzle-mini-css-extract-loader'
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: razzleOptions.enableSourceMaps,
                  importLoaders: 1,
                  modules: {
                    auto: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]',
                  },
                },
                ident: 'razzle-css-loader'
              },
              {
                loader: require.resolve('postcss-loader'),
                options: postCssOptions,
                ident: 'razzle-postcss-loader'
              },
            ],
          },
        ],
      },
    };

    config.plugins = [
      // Ignore assets.json and chunks.json to avoid infinite recompile bug
      new webpack.WatchIgnorePlugin(
        webpackMajor === 5
        ? { paths: webpackOptions.watchIgnorePaths }
        : webpackOptions.watchIgnorePaths
      ),
    ];

    if (IS_NODE) {
      // We want to uphold node's __filename, and __dirname.
      config.node = {
        __dirname: false,
        __filename: false,
      };

      const nodeExternals = Array.isArray(webpackOptions.nodeExternals)
        ? webpackOptions.nodeExternals : [webpackOptions.nodeExternals];

      // We need to tell webpack what to bundle into our Node bundle.
      config.externals = (!IS_SERVERLESS ? [nodeExternalsFunc] : []).concat(nodeExternals);

      // Specify webpack Node.js output path and filename
      config.output = {
        path: paths.appBuild,
        publicPath: clientPublicPath,
        filename: webpackOptions.jsOutputFilename,
        chunkFilename: webpackOptions.jsOutputChunkFilename,
        libraryTarget: 'commonjs2',
      };

      if (webpackMajor === 5) {
        config.output.library = {
          type: 'commonjs2'
        };
      }

      // Add some plugins...
      config.plugins = [
        ...config.plugins,
        // We define environment variables that can be accessed globally in our
        new webpack.DefinePlugin(webpackOptions.definePluginOptions),
      ];

      config.entry = {
        server: [paths.appServerIndexJs],
      };

      // make sure the key exists
      config.optimization = {};

      if (IS_PROD) {
        // Prevent creating multiple chunks for the server
        // in dev mode emitting one huge server file on every save is very slow
        if (!IS_DEV_ENV) {
          config.plugins.push(
            new webpack.optimize.LimitChunkCountPlugin({
              maxChunks: 1,
            })
          );
          config.optimization = {
            minimize: true,
            minimizer: [
              new TerserPlugin(webpackOptions.terserPluginOptions)
            ],
          }
        }
        if (webpackMajor === 5) {
          config.optimization.emitOnErrors = razzleOptions.emitOnErrors;
        } else {
          config.optimization.noEmitOnErrors = !razzleOptions.emitOnErrors;
        }
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

        config.plugins = [
          ...config.plugins,
          // Add hot module replacement
          new webpack.HotModuleReplacementPlugin(),
          // Supress errors to console (we use our own logger)
          !disableStartServer &&
            new StartServerPlugin(webpackOptions.startServerOptions),
        ].filter(x => x);
      }
    }

    if (IS_WEB) {
      //
      // config.node = {
      //   fs: 'empty',
      // };

      // Extract our CSS into files.
      const miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: webpackOptions.cssOutputFilename,
        chunkFilename: webpackOptions.cssOutputChunkFilename,
      });

      config.plugins = [
        ...config.plugins,
        webpackMajor === 5 && new webpack.ProvidePlugin({
          Buffer: [require.resolve('buffer'), 'Buffer'],
          process: [require.resolve('process')],
        }),
        // Output all files in a manifest file called assets-manifest.json
        // in the build directory.
        new ManifestPlugin({
          fileName: webpackOptions.appAssetsManifestPath,
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
              const allFiles = []
                .concat(
                  ...(entry.chunks || []).map(chunk =>
                    chunk.files.map(path => !path.startsWith('/.') && config.output.publicPath + path)
                  )
                )
                .filter(Boolean);

              const filesByType = allFiles.reduce((types, file) => {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                types[fileType] = types[fileType] || [];
                types[fileType].push(file);
                return types;
              }, {});

              const chunkIds = [].concat(
                ...(entry.chunks || []).map(chunk => chunk.ids)
              );

              return name
                ? {
                    ...acc,
                    [name]:  { ...filesByType, chunks: chunkIds },
                  }
                : acc;
            }, seed);
            entryArrayManifest['noentry'] = [...noChunkFiles]
              .map(file => !file.path.includes('/.') && file.path)
              .filter(Boolean)
              .reduce((types, file) => {
                const fileType = file.slice(file.lastIndexOf('.') + 1);
                types[fileType] = types[fileType] || [];
                types[fileType].push(file);
                return types;
              }, {});
            return entryArrayManifest;
          },
        })
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
          filename: webpackOptions.jsOutputFilename,
          chunkFilename: webpackOptions.jsOutputChunkFilename,
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
        //
        // First assign the dev server props that are common to v3 and v4
        config.devServer = {
          compress: true, // watchContentBase: true,
          headers: { 'Access-Control-Allow-Origin': '*' },
          historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebookincubator/create-react-app/issues/387.
            disableDotRule: true,
          },
          hot: true,
          host: dotenv.raw.HOST,
          port: devServerPort,
        };
        // If the major version is > 3, then use the newer configuration notation
        if (devServerMajorVersion > 3) {
          // See https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md for how this was migrated
          config.devServer = Object.assign(config.devServer, {
            allowedHosts: 'all',
            client: {
              logging: 'none', // Enable gzip compression of generated files.
              overlay: false,
            },
            devMiddleware: {
              publicPath: clientPublicPath,
            },
            static: {
              // Reportedly, this avoids CPU overload on some systems.
              // https://github.com/facebookincubator/create-react-app/issues/293
              watch: { ignored: /node_modules/ },
            },
            onBeforeSetupMiddleware(server) {
              // This lets us open files from the runtime error overlay.
              server.app.use(errorOverlayMiddleware());
            },
          });
        } else {
          config.devServer = Object.assign(config.devServer, {
            disableHostCheck: true,
            clientLogLevel: 'none', // Enable gzip compression of generated files.
            publicPath: clientPublicPath,
            noInfo: true,
            overlay: false,
            quiet: true, // By default files from `contentBase` will not trigger a page reload.
            // Reportedly, this avoids CPU overload on some systems.
            // https://github.com/facebookincubator/create-react-app/issues/293
            watchOptions: { ignored: /node_modules/ },
            before(app) {
              // This lets us open files from the runtime error overlay.
              app.use(errorOverlayMiddleware());
            },
          });
        }

        // Add client-only development plugins
        config.plugins = [
          ...config.plugins,
          devServerMajorVersion > 3
            ? null // avoid warning since v4 automatically adds the HRM plugin when `hot` is true
            : new webpack.HotModuleReplacementPlugin({
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
          razzleOptions.staticCssInDev ? miniCssExtractPlugin : null,
        ].filter(x => x);

        config.optimization = {
          splitChunks: webpackOptions.splitChunksConfig,
        };
      } else {
        // Specify production entry point (/client/index.js)
        config.entry = {
          client: paths.appClientIndexJs,
        };

        const clientExternals = Array.isArray(webpackOptions.clientExternals)
          ? webpackOptions.clientExternals : [webpackOptions.clientExternals];

        // We need to tell webpack what to bundle into our client bundle.
        config.externals = clientExternals;

        // Specify the client output directory and paths. Notice that we have
        // changed the publicPath to just '/' from http://localhost:3001. This is because
        // we will only be using one port in production.
        config.output = {
          path: paths.appBuildPublic,
          publicPath: dotenv.raw.PUBLIC_PATH || '/',
          filename: webpackOptions.jsOutputFilename,
          chunkFilename: webpackOptions.jsOutputChunkFilename,
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
          miniCssExtractPlugin,
          IS_DEV_ENV || webpackMajor === 5 ? null : new webpack.HashedModuleIdsPlugin(),
          IS_DEV_ENV ? null : new webpack.optimize.AggressiveMergingPlugin(),
          hasPublicDir && new CopyPlugin({
            patterns: [
              {
                from: paths.appPublic.replace(/\\/g, '/') + '/**/*',
                to: paths.appBuild,
                context: paths.appPath,
                globOptions: {
                  ignore: [paths.appPublic.replace(/\\/g, '/') + "/index.html"],
                }
              },
            ]
          }),
        ].filter(x => x);

        // make sure the key exists
        config.optimization = {};

        if (!IS_DEV_ENV) {
          config.optimization = {
            splitChunks: webpackOptions.splitChunksConfig,
            moduleIds: webpackMajor === 5 ? 'deterministic' : 'hashed',
            minimize: true,
            minimizer: [
              new TerserPlugin(webpackOptions.terserPluginOptions),
              new CssMinimizerPlugin({
                sourceMap: razzleOptions.enableSourceMaps,
                minimizerOptions: {
                  sourceMap: razzleOptions.enableSourceMaps
                },
                minify: async (data, inputMap, minimizerOptions) => {
                  // eslint-disable-next-line global-require
                  const CleanCSS = require('clean-css');

                  const [[filename, input]] = Object.entries(data);
                  const minifiedCss = await new CleanCSS({ sourceMap: minimizerOptions.sourceMap }).minify({
                    [filename]: {
                      styles: input,
                      sourceMap: inputMap,
                    },
                  });

                  return {
                    css: minifiedCss.styles,
                    map: minifiedCss.sourceMap ? minifiedCss.sourceMap.toJSON() : '',
                    warnings: minifiedCss.warnings,
                  };
                },
              })
            ],
          }
        }
        if (webpackMajor === 5) {
          config.optimization.emitOnErrors = razzleOptions.emitOnErrors;
        } else {
          config.optimization.noEmitOnErrors = !razzleOptions.emitOnErrors;
        }
      }

      if (clientOnly) {
        if (IS_DEV) {
          if (devServerMajorVersion > 3) {
            // See https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md for how this was migrated
            config.devServer.static.directory = paths.appPublic;
            if (!config.devServer.static.watch) {
              config.devServer.static.watch = true;
            }
          } else {
            config.devServer.contentBase = paths.appPublic;
            config.devServer.watchContentBase = true;
          }
        }
      }

      if (webpackOptions.enableHtmlWebpackPlugin) {
        config.plugins = [
          ...config.plugins,
          // Generates an `index.html` file with the <script> injected.
          new HtmlWebpackPlugin(webpackOptions.htmlWebpackPluginOptions),
        ];
      }
    }

    if (IS_DEV && !shouldDisableWebpackbar) {
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
          env: { target, dev: IS_DEV, serverless: IS_SERVERLESS },
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
        env: { target, dev: IS_DEV, serverless: IS_SERVERLESS },
        webpackConfig: config,
        webpackObject: webpackObject,
        options: {
          razzleOptions,
          webpackOptions,
        },
        paths,
      });
    }
    if (razzleOptions.debug.config) {
      console.log(`Printing webpack config for ${target} target`);
      console.log(util.inspect(config, {depth: null}));
    }
    resolve(config);
  });
};
