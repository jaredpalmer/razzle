// Based on: https://gist.github.com/jaredpalmer/0a91a7bd354b875b913c74f4b16125f7

const path = require('path')
const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  modify: (baseConfig, { target, dev }, webpack) => {

    const appConfig = Object.assign({}, baseConfig)
    const isServer = target !== 'web'

    const postCssLoader = {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
        plugins: () => [
          autoprefixer({
            browsers: [
              '>1%',
              'last 4 versions',
              'Firefox ESR',
              'not ie < 9' // React doesn't support IE8 anyway
            ]
          })
        ]
      }
    }

    appConfig.module.rules.push({
      test: /.scss$/,
      use:
      // On the server, we simply use css-loader to deal with scss imports
      isServer ? 'css-loader' :
      // For development, include source map
      dev
      ? [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: false,
            sourceMap: true,
          },
        },
        postCssLoader,
        'fast-sass-loader',
      ]
      // For production, extract CSS
      : ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          postCssLoader,
          'fast-sass-loader',
        ],
      })
    })

    if (!isServer && !dev) {
      appConfig.plugins.push(
        new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
      )
    }

    return appConfig
  }
}