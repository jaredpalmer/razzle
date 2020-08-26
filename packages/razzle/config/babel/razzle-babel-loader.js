'use strict';

const babelLoader = require('babel-loader');
const hash = require('string-hash');
const path = require('path');
const basename = path.basename;
const join = path.join;

// increment 'm' to invalidate cache
// eslint-disable-razzle-line no-useless-concat
const cacheKey = 'babel-cache-' + 'm' + '-';
const razzleBabelPreset = require('babel-preset-razzle/razzle-four-preset');

const getModernOptions = function(babelOptions) {
  babelOptions = babelOptions || {};
  const presetEnvOptions = Object.assign({}, babelOptions['preset-env']);
  const transformRuntimeOptions = Object.assign(
    {},
    babelOptions['transform-runtime'],
    { regenerator: false }
  );

  presetEnvOptions.targets = {
    esmodules: true,
  };
  presetEnvOptions.exclude = (presetEnvOptions.exclude || []).concat([
    // Block accidental inclusions
    'transform-regenerator',
    'transform-async-to-generator',
  ]);

  return Object.assign({}, babelOptions, {
    'preset-env': presetEnvOptions,
    'transform-runtime': transformRuntimeOptions,
  });
};

const razzleBabelPresetModern = function(presetOptions) {
  return function(context) {
    return razzleBabelPreset(context, getModernOptions(presetOptions));
  };
};

module.exports = babelLoader.custom(function(babel) {
  const presetItem = babel.createConfigItem(razzleBabelPreset, {
    type: 'preset',
  });
  const applyCommonJs = babel.createConfigItem(
    require('babel-preset-razzle/babel-plugins/commonjs'),
    { type: 'plugin' }
  );
  const commonJsItem = babel.createConfigItem(
    require('@babel/plugin-transform-modules-commonjs'),
    { type: 'plugin' }
  );

  const configs = new Set();

  return {
    customOptions: function(opts) {
      const custom = {
        isServer: opts.isServer,
        isModern: opts.isModern,
        hasModern: opts.hasModern,
        babelPresetPlugins: opts.babelPresetPlugins,
        development: opts.development,
        hasReactRefresh: opts.hasReactRefresh,
      };
      const filename = join(opts.cwd, 'noop.js');
      const loader = Object.assign(
        opts.cache
          ? {
              cacheCompression: false,
              cacheDirectory: join(opts.cwd, 'cache', 'razzle-babel-loader'),
              cacheIdentifier:
                cacheKey +
                (opts.isServer ? '-server' : '') +
                (opts.isModern ? '-modern' : '') +
                (opts.hasModern ? '-has-modern' : '') +
                '-new-polyfills' +
                (opts.development ? '-development' : '-production') +
                (opts.hasReactRefresh ? '-react-refresh' : '') +
                JSON.stringify(
                  babel.loadPartialConfig({
                    filename,
                    cwd: opts.cwd,
                    sourceFileName: filename,
                  }).options
                ),
            }
          : {
              cacheDirectory: false,
            },
        opts
      );

      delete loader.isServer;
      delete loader.cache;
      delete loader.distDir;
      delete loader.isModern;
      delete loader.hasModern;
      delete loader.babelPresetPlugins;
      delete loader.development;
      delete loader.hasReactRefresh;
      return { loader, custom };
    },
    config: function(cfg, cfgOpts) {
      const source = cfgOpts.source;
      const customOptions = cfgOpts.customOptions;
      const isServer = customOptions.isServer;
      const isModern = customOptions.isModern;
      const hasModern = customOptions.hasModern;
      const babelPresetPlugins = customOptions.babelPresetPlugins;
      const development = customOptions.development;
      const hasReactRefresh = customOptions.hasReactRefresh;

      const filename = this.resourcePath;
      const options = Object.assign({}, cfg.options);

      if (cfg.hasFilesystemConfig()) {
        for (const file of [cfg.babelrc, cfg.config]) {
          // We only log for client compilation otherwise there will be double output
          if (file && !isServer && !configs.has(file)) {
            configs.add(file);
            console.info(`Using external babel configuration from ${file}`);
          }
        }
      } else {
        // Add our default preset if the no "babelrc" found.
        options.presets = (options.presets || []).concat([presetItem]);
      }

      options.caller.isServer = isServer;
      options.caller.isModern = isModern;
      options.caller.isDev = development;

      const emitWarning = this.emitWarning.bind(this);
      Object.defineProperty(options.caller, 'onWarning', {
        enumerable: false,
        writable: false,
        value: (options.caller.onWarning = function(reason) {
          if (!(reason instanceof Error)) {
            reason = new Error(reason);
          }
          emitWarning(reason);
        }),
      });

      options.plugins = options.plugins || [];

      if (hasReactRefresh) {
        const reactRefreshPlugin = babel.createConfigItem(
          [require('react-refresh/babel'), { skipEnvCheck: true }],
          { type: 'plugin' }
        );
        options.plugins.unshift(reactRefreshPlugin);
        if (!isServer) {
          const noAnonymousDefaultExportPlugin = babel.createConfigItem(
            [
              require('babel-preset-razzle/babel-plugins/no-anonymous-default-export'),
              {},
            ],
            { type: 'plugin' }
          );
          options.plugins.unshift(noAnonymousDefaultExportPlugin);
        }
      }

      if (isModern) {
        const razzlePreset = options.presets.find(
          preset => preset && preset.value === razzleBabelPreset
        ) || { options: {} };

        const additionalPresets = options.presets.filter(
          preset => preset !== razzlePreset
        );

        const presetItemModern = babel.createConfigItem(
          razzleBabelPresetModern(razzlePreset.options),
          {
            type: 'preset',
          }
        );

        options.presets = (additionalPresets || []).concat([presetItemModern]);
      }

      // If the file has `module.exports` we have to transpile commonjs because Babel adds `import` statements
      // That break webpack, since webpack doesn't support combining commonjs and esmodules
      if (!hasModern && source.indexOf('module.exports') !== -1) {
        options.plugins.push(applyCommonJs);
      }

      options.plugins.push([
        require.resolve('babel-plugin-transform-define'),
        {
          'process.env.NODE_ENV': development ? 'development' : 'production',
          'typeof window': isServer ? 'undefined' : 'object',
          'process.browser': isServer ? false : true,
        },
        'razzle-js-transform-define-instance',
      ]);

      // As lib has stateful modules we have to transpile commonjs
      options.overrides = options.overrides || [];
      // .concat([
      //   {
      //     test: [
      //       /razzle[\\/]dist[\\/]lib/,
      //     ],
      //     plugins: [commonJsItem],
      //   },
      // ])

      for (const plugin of babelPresetPlugins) {
        require(join(plugin.dir, 'src', 'babel-preset-build.js'))(
          options,
          plugin.config || {}
        );
      }

      return options;
    },
  };
});
