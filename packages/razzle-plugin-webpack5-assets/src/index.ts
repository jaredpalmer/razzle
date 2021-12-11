import {
  Webpack5AssetsPluginOptions,
  Webpack5AssetsRazzlePlugin,
} from "./types";
import defaultOptions from "./defaultOptions.js";
import path from "path";

export * from "./types.js";

const Plugin: Webpack5AssetsRazzlePlugin = {
  name: "webpack5-externals",
  defaultOptions: defaultOptions,
  modifyWebpackConfig: (
    pluginOptions,
    razzleConfig,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    if (webpackOptions.isNode) {
        webpackConfig?.module?.rules?.push(...[{
          test: /\.png$/i,
          type: "asset/resource",
          generator: {
            emit: webpackOptions.isWeb
          },
        },{
          test: /\.png$/i,
          type: "asset",
          generator: {
            emit: webpackOptions.isWeb
          },
        }]);
    }
    return webpackConfig;
  },
};

export default function (options: Webpack5AssetsPluginOptions): {
  plugin: Webpack5AssetsRazzlePlugin;
  options: Webpack5AssetsPluginOptions;
} {
  return {
    plugin: Plugin,
    options: { ...(Plugin.defaultOptions || {}), ...options },
  };
}
