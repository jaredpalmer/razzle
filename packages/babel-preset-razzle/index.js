'use strict';

const path = require('path');
const PluginItem = require('@babel/core').PluginItem;
const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const isDevelopment = env === 'development';
const isTest = env === 'test';

// Taken from https://github.com/babel/babel/commit/d60c5e1736543a6eac4b549553e107a9ba967051#diff-b4beead8ad9195361b4537601cc22532R158
const supportsStaticESM = function(caller) {
  return !!caller && caller.supportsStaticESM;
};

module.exports = function(api, options) {
  options = options || {};

  const supportsESM = api.caller(supportsStaticESM);
  const isServer = api.caller(function(caller) {
    return !!caller && caller.isServer;
  });
  const isModern = api.caller(function(caller) {
    return !!caller && caller.isModern;
  });

  const isLaxModern =
    isModern ||
    ((options['preset-env'] || {}).targets &&
      options['preset-env'].targets.esmodules === true);

  const presetEnvConfig = Object.assign(
    {
      // In the test environment `modules` is often needed to be set to true, babel figures that out by itself using the `'auto'` option
      // In production/development this option is set to `false` so that webpack can handle import/export with tree-shaking
      modules: 'auto',
      exclude: ['transform-typeof-symbol'],
    },
    options['preset-env'] || {}
  );

  // When transpiling for the server or tests, target the current Node version
  // if not explicitly specified:
  if (
    (isServer || isTest) &&
    (!presetEnvConfig.targets ||
      !(
        typeof presetEnvConfig.targets === 'object' &&
        'node' in presetEnvConfig.targets
      ))
  ) {
    presetEnvConfig.targets = {
      // Targets the current process' version of Node. This requires apps be
      // built and deployed on the same version of Node.
      node: 'current',
    };
  }

  // specify a preset to use instead of @babel/preset-env
  const customModernPreset =
    isLaxModern && options['experimental-modern-preset'];

  return {
    sourceType: 'unambiguous',
    presets: [
      customModernPreset || [
        require('@babel/preset-env').default,
        presetEnvConfig,
      ],
      [
        require('@babel/preset-react'),
        Object.assign(
          {
            // This adds @babel/plugin-transform-react-jsx-source and
            // @babel/plugin-transform-react-jsx-self automatically in development
            development: isDevelopment || isTest,
          },
          (options['preset-react'] || {}).runtime !== 'automatic' ? { pragma: '__jsx' } : {},
          options['preset-react'] || {}
        ),
      ],
      options['preset-typescript'] !== false && [
        require('@babel/preset-typescript'),
        Object.assign(
          { allowNamespaces: true, allExtensions: true, isTSX: true },
          options['preset-typescript'] || {}
        ),
      ],
    ].filter(Boolean),
    plugins: [
      (options['preset-react'] || {}).runtime !== 'automatic' && [
        require('./babel-plugins/jsx-pragma'),
        {
          // This produces the following injected import for modules containing JSX:
          //   import React from 'react';
          //   var __jsx = React.createElement;
          module: 'react',
          importAs: 'React',
          pragma: '__jsx',
          property: 'createElement',
        },
      ],
      [
        require('./babel-plugins/optimize-hook-destructuring'),
        {
          // only optimize hook functions imported from React/Preact
          lib: true,
        },
      ],
      require('@babel/plugin-syntax-dynamic-import'),
      options['class-properties'] !== false && [
        require('@babel/plugin-proposal-class-properties'),
        options['class-properties'] || {},
      ],
      [
        require('@babel/plugin-proposal-object-rest-spread'),
        {
          useBuiltIns: true,
        },
      ],
      !isServer && [
        require('@babel/plugin-transform-runtime'),
        Object.assign(
          {
            corejs: false,
            helpers: true,
            regenerator: true,
            useESModules: supportsESM && presetEnvConfig.modules !== 'commonjs',
            absoluteRuntime: path.dirname(
              require.resolve('@babel/runtime/package.json')
            ),
            version: require('@babel/runtime/package.json').version,
          },
          options['transform-runtime'] || {}
        ),
      ],
      isProduction && [
        require('babel-plugin-transform-react-remove-prop-types'),
        {
          removeImport: true,
        },
      ],
      require('@babel/plugin-proposal-optional-chaining'),
      require('@babel/plugin-proposal-nullish-coalescing-operator'),
      isServer && require('@babel/plugin-syntax-bigint'),
      [require('@babel/plugin-proposal-numeric-separator').default, false],
    ].filter(Boolean)
  };
};
