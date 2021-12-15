import {
  PluginOptions,
  Plugin,
} from "./types";

export * from "./types.js";

const plugin: Plugin = {
  name: "webpack5-assets",
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
    if (webpackOptions.isWeb) {
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
  plugin: Plugin;
  options: PluginOptions;
} {
  return {
    plugin: plugin,
    options: { ...(plugin.defaultOptions || {}), ...options },
  };
}
