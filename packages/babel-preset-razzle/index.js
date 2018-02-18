// https://github.com/facebook/create-react-app/blob/next/packages/babel-preset-react-app/index.js
'use strict';

module.exports = (
  api,
  opts // Options for `preset-env` and `preset-react`
) => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  const isEnvDevelopment = env === 'development';
  const isEnvTest = env === 'test';
  const isEnvProduction = env == 'production';
  const isEnvUnknown = !isEnvDevelopment && !isEnvProduction && !isEnvTest;

  if (isEnvUnknown) {
    throw new Error(
      'Using `babel-preset-razzle` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.'
    );
  }

  const defaults = {
    envTest: {
      targets: {
        node: '6.12',
        // https://git.io/vA8Vr
      },
    },
    envRest: {
      modules: false,
      // Do not transform ESM to CJS
      // https://git.io/vA8cw
    },
    react: {
      development: isEnvDevelopment || isEnvTest,
      // Adds component stack to warning messages
      // Adds __self attribute to JSX which React will use for some warnings
      // https://git.io/vA8cr
    },
  };

  if (!opts) {
    opts = defaults;
  }

  function optionsFor(preset) {
    return opts.hasOwnProperty(preset) ? opts[preset] : defaults[preset];
  }

  // Async transform plugins are included by default.
  // Therefore they must be explicitly `exclude`d in `@babel/preset-env` options.
  const isAsyncTransformEnabled = (() => {
    let excluded = (() => {
      let { exclude = [] } = isEnvTest
        ? optionsFor('envTest')
        : optionsFor('envRest');
      return exclude.join();
    })();
    return (
      !/transform-async-to-generator/.test(excluded) &&
      !/transform-regenerator/.test(excluded)
    );
  })();

  return {
    presets: [
      (isEnvDevelopment || isEnvProduction) && [
        require('@babel/preset-env').default,
        optionsFor('envRest'),
      ],
      isEnvTest && [
        require('@babel/preset-env').default,
        optionsFor('envTest'),
      ],
      [require('@babel/preset-react').default, optionsFor('react')],
    ].filter(Boolean),
    plugins: [
      // Necessary to include regardless of the environment because
      // in practice some other transforms (such as object-rest-spread)
      // don't work without it: https://github.com/babel/babel/issues/7215
      require('@babel/plugin-transform-destructuring').default,
      require('@babel/plugin-proposal-class-properties').default,
      // Assumes `Object.assign` is available.
      [
        require('@babel/plugin-proposal-object-rest-spread').default,
        { useBuiltIns: true },
      ],
      // Transforms JSX with built-ins instead of the default polyfilling behavior.
      [
        require('@babel/plugin-transform-react-jsx').default,
        {
          useBuiltIns: true,
        },
      ],
      require('@babel/plugin-syntax-dynamic-import').default,
      isAsyncTransformEnabled && [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          polyfill: false,
          regenerator: true,
        },
      ],
      isAsyncTransformEnabled && [
        require('@babel/plugin-transform-regenerator').default,
        {
          // Async functions are converted to generators by `@babel/preset-env`.
          async: false,
        },
      ],
      isEnvTest && require('babel-plugin-dynamic-import-node').default,
      isEnvProduction && [
        require('babel-plugin-transform-react-remove-prop-types').default,
        { removeImport: true },
      ],
    ].filter(Boolean),
  };
};
