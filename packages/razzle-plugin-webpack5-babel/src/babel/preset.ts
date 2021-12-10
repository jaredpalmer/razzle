import presetEnv from '@babel/preset-env'
import presetReact from '@babel/preset-react'
import presetTypescript from '@babel/preset-typescript'
import jsxPragma from './plugins/jsx-pragma.js'
import optimizeHookDestructuring from './plugins/optimize-hook-destructuring.js'
import pluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import'
import pluginProposalClassProperties from '@babel/plugin-proposal-class-properties'
import pluginProposalObjectRestSpread from '@babel/plugin-proposal-object-rest-spread'
import pluginTransformRuntime from '@babel/plugin-transform-runtime'
import pluginTransformReactRemovePropTypes from 'babel-plugin-transform-react-remove-prop-types'
import pluginSyntaxBigint from '@babel/plugin-syntax-bigint'
import pluginProposalNumericSeparator from '@babel/plugin-proposal-numeric-separator'
import pluginProposalExportNamespaceFrom from '@babel/plugin-proposal-export-namespace-from'
import { PluginItem } from '@babel/core'
import { dirname } from 'path'

const isLoadIntentTest = process.env.NODE_ENV === 'test'
const isLoadIntentDevelopment = process.env.NODE_ENV === 'development'

type RazzleBabelPresetOptions = {
  'preset-env'?: any
  'preset-react'?: any
  'class-properties'?: any
  'transform-runtime'?: any
  'preset-typescript'?: any
}

type BabelPreset = {
  presets?: PluginItem[] | null
  plugins?: PluginItem[] | null
  sourceType?: 'script' | 'module' | 'unambiguous'
  overrides?: Array<{ test: RegExp } & Omit<BabelPreset, 'overrides'>>
}

function supportsStaticESM(caller: any): boolean {
  return !!caller?.supportsStaticESM
}

export default (
  api: any,
  options: RazzleBabelPresetOptions = {}
): BabelPreset => {
  const supportsESM = api.caller(supportsStaticESM)
  const isServer = api.caller((caller: any) => !!caller && caller.isServer)
  const isCallerDevelopment = api.caller((caller: any) => caller?.isDev)

  // Look at external intent if used without a caller (e.g. via Jest):
  const isTest = isCallerDevelopment == null && isLoadIntentTest

  // Look at external intent if used without a caller (e.g. Storybook):
  const isDevelopment =
    isCallerDevelopment === true ||
    (isCallerDevelopment == null && isLoadIntentDevelopment)

  // Default to production mode if not 'test' nor 'development':
  const isProduction = !(isTest || isDevelopment)

  const isBabelLoader = api.caller(
    (caller: any) =>
      !!caller &&
      (caller.name === 'babel-loader' ||
        caller.name === 'razzle-babel-loader')
  )

  const useJsxRuntime =
    options['preset-react']?.runtime === 'automatic' ||
    (Boolean(api.caller((caller: any) => !!caller && caller.hasJsxRuntime)) &&
      options['preset-react']?.runtime !== 'classic')

  const presetEnvConfig = {
    // In the test environment 'modules' is often needed to be set to true, babel figures that out by itself using the ''auto'' option
    // In production/development this option is set to 'false' so that webpack can handle import/export with tree-shaking
    modules: 'auto',
    exclude: ['transform-typeof-symbol'],
    include: [
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
    ],
    ...options['preset-env'],
  }

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
      // This is the same as using "current" but explicit
      node: process.versions.node,
    }
  }

  return {
    sourceType: 'unambiguous',
    presets: [
      [presetEnv, presetEnvConfig],
      [
        presetReact,
        {
          // This adds @babel/plugin-transform-react-jsx-source and
          // @babel/plugin-transform-react-jsx-self automatically in development
          development: isDevelopment || isTest,
          ...(useJsxRuntime ? { runtime: 'automatic' } : { pragma: '__jsx' }),
          ...options['preset-react'],
        },
      ],
      [
        presetTypescript,
        { allowNamespaces: true, ...options['preset-typescript'] },
      ],
    ],
    plugins: [
      !useJsxRuntime && [
        jsxPragma,
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
        optimizeHookDestructuring,
        {
          // only optimize hook functions imported from React/Preact
          lib: true,
        },
      ],
      pluginSyntaxDynamicImport,
      [
        pluginProposalClassProperties,
        options['class-properties'] || {},
      ],
      [
        pluginProposalObjectRestSpread,
        {
          useBuiltIns: true,
        },
      ],
      !isServer && [
        pluginTransformRuntime,
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: supportsESM && presetEnvConfig.modules !== 'commonjs',
          absoluteRuntime: isBabelLoader
            ? dirname(require.resolve('@babel/runtime/package.json'))
            : undefined,
          ...options['transform-runtime'],
        },
      ],
      isProduction && [
        pluginTransformReactRemovePropTypes,
        {
          removeImport: true,
        },
      ],
      isServer && pluginSyntaxBigint,
      // Always compile numeric separator because the resulting number is
      // smaller.
      pluginProposalNumericSeparator,
      pluginProposalExportNamespaceFrom,
    ].filter(Boolean),
  }
}
