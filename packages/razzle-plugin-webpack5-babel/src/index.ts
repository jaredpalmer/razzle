import path from "path";

import { PluginOptions, Plugin } from "./types";

const plugin: Plugin = {
  name: "webpack5-babel",
  defaultOptions: {},
  modifyConfig: (
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
          include: [razzleContext.paths.appSrc], //.concat(additionalIncludes)
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

export default function (options: PluginOptions): {
  plugin: Plugin,
  options: PluginOptions
} {
  return {
    plugin: plugin,
    options: { ...(plugin.defaultOptions || {}), ...options },
  };
}
