const ExtractTextPlugin = require('extract-text-webpack-plugin')
const antdTheme = require('../src/antdTheme') // <- Include variables to override antd theme

const extractLess = new ExtractTextPlugin({
  filename: 'static/css/[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development', // disable this during development
})

module.exports = (config, webpack) => ({
  ...config,
  module: {
    ...config.module,
    rules: [
      ...config.module.rules,
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [['import', { libraryName: 'antd', style: true }]],
        },
      },
      {
        test: /\.less$/,
        // use the ExtractTextPlugin instance
        use: extractLess.extract({
          use: [
            {
              loader: 'css-loader',
            },
            {
              loader: 'less-loader',
              options: {
                modifyVars: antdTheme,
              },
            },
          ],
          // use style-loader in development
          fallback: 'style-loader',
        }),
      },
    ],
  },
  plugins: [
    ...config.plugins,
    extractLess, // <- Add the ExtractTextPlugin instance here
  ],
})
