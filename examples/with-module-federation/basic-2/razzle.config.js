'use strict';

const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");
const deps = require("./package.json").dependencies;

module.exports = {
  options: {
    buildType: 'spa',
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    const url = opts.env.dev ?
      process.env.FEDERATED_URL_DEV : process.env.FEDERATED_URL;

    config.plugins.push(
      new ModuleFederationPlugin({
        name: "app2",
        filename: "remoteEntry.js",
        remotes: {
          app1: `app1@${url}remoteEntry.js`,
        },
        exposes: {
          "./Button": "./src/Button",
        },
        shared: [
          {
            ...deps,
            react: {
              // eager: true,
              singleton: true,
              requiredVersion: deps.react,
            },
            "react-dom": {
              // eager: true,
              singleton: true,
              requiredVersion: deps["react-dom"],
            },
          },
        ],
      })
    )

    return config;
  },
};
