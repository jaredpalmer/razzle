import { PluginOptions, Plugin } from "./types";

import type * as types from "./types";
export { types };

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
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    webpackConfig?.module?.rules?.push(
      ...[
        {
          test: /\.png$/i,
          type: "asset/resource",
          generator: {
            emit: webpackOptions.isClient,
          },
        },
        {
          test: /\.png$/i,
          type: "asset",
          generator: {
            emit: webpackOptions.isClient,
          },
        },
      ]
    );
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
