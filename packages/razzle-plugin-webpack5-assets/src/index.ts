import {
  PluginOptions,
  AssetsPlugin,
} from "./types";

export * from "./types.js";

const Plugin: AssetsPlugin = {
  name: "webpack5-externals",
  defaultOptions: {
    assetResourceExclude: [
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
      /\.png$/,
    ],
    assetAutoTest: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    assetAutoSize: 1024 * 4,
  },
  modifyConfig: (
    pluginOptions,
    razzleConfig,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    if (webpackOptions.isNode) {
      webpackConfig?.module?.rules?.push(
        ...[
          {
            test: /\.png$/i,
            type: "asset/resource",
            generator: {
              emit: webpackOptions.isWeb,
            },
          },
          {
            test: /\.png$/i,
            type: "asset",
            generator: {
              emit: webpackOptions.isWeb,
            },
          },
        ]
      );
    }
    return webpackConfig;
  },
};

export default function (options: PluginOptions): {
  plugin: AssetsPlugin;
  options: PluginOptions;
} {
  return {
    plugin: Plugin,
    options: { ...(Plugin.defaultOptions || {}), ...options },
  };
}
