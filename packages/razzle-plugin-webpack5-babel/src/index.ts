import path from "path";

import defaultOptions from "./defaultOptions.js";
import { Webpack5BabelPluginOptions, Webpack5BabelRazzlePlugin } from "./types";
export * from "./types.js";

const Plugin: Webpack5BabelRazzlePlugin = {
  name: "webpack5-babel",
  defaultOptions: defaultOptions,
  modifyWebpackConfig: (
    pluginOptions,
    razzleConfig,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    webpackConfig?.module?.rules?.push(
      ...[
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          use: [
            {
              loader: "razzle-plugin-webpack5-babel/loader",
              options: {
                isServer: webpackOptions.isNode,
                cwd: razzleContext.paths.appPath,
                cache: true,
                babelPresetPlugins: [],
                hasModern: false, // !!config.experimental.modern,
                development: webpackOptions.isDev,
                hasReactRefresh: false,
              },
            },
          ],
        },
      ]
    );
    return webpackConfig;
  },
};

export default function (options: Webpack5BabelPluginOptions): {
  plugin: Webpack5BabelRazzlePlugin;
  options: Webpack5BabelPluginOptions;
} {
  return {
    plugin: Plugin,
    options: { ...(Plugin.defaultOptions || {}), ...options },
  };
}
