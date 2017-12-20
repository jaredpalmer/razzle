"use strict";

const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = Object.assign({}, config);
    const isServer = target !== "web";
    const postCSSLoaderOptions = {
      ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
      plugins: () => [
        require("postcss-flexbugs-fixes"),
        autoprefixer({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9" // React doesn't support IE8 anyway
          ],
          flexbox: "no-2009"
        })
      ]
    };

    const cssConfig = modules =>
      [
        {
          loader: require.resolve("css-loader"),
          options: {
            importLoaders: 1,
            minimize: !dev,
            sourceMap: !dev,
            modules: modules,
            localIdentName: modules ? "[path]__[name]___[local]" : undefined
          }
        },
        isServer && {
          loader: require.resolve("postcss-loader"),
          options: postCSSLoaderOptions
        }
      ].filter(x => !!x);
    const css = cssConfig(false);
    const cssModules = cssConfig(true);

    const i = appConfig.module.rules.findIndex(
      rule => rule.test && !!".css".match(rule.test)
    );

    if (!dev && !isServer) {
      appConfig.module.rules[i] = {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve("style-loader"),
            options: {
              hmr: false
            }
          },
          use: css
        })
      };
      appConfig.module.rules.push({
        test: /\.module\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: {
            loader: require.resolve("style-loader"),
            options: {
              hmr: false
            }
          },
          use: cssModules
        })
      });
      appConfig.plugins.push(
        new ExtractTextPlugin("static/css/[name].[contenthash:8].css")
      );
    } else if (!dev && isServer) {
      appConfig.module.rules[i] = {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: css
      };
      appConfig.module.rules.push({
        test: /\.module\.css$/,
        use: [
          isServer && require.resolve("isomorphic-style-loader"),
          ...cssModules
        ].filter(x => !!x)
      });
    } else {
      appConfig.module.rules[i] = {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [!isServer && require.resolve("style-loader"), ...css].filter(
          x => !!x
        )
      };
      appConfig.module.rules.push({
        test: /\.module\.css$/,
        use: [
          isServer
            ? require.resolve("isomorphic-style-loader")
            : require.resolve("style-loader"),
          ...cssModules
        ].filter(x => !!x)
      });
    }

    return appConfig;
  }
};
