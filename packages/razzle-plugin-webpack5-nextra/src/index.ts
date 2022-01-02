import { PluginOptions, Plugin } from "./types";
import withNextra from "nextra";
import type * as types from "./types";
import { webpack } from "webpack";
export { types };

const plugin: Plugin = {
  name: "webpack5-nextra",
  defaultOptions: {},
  modifyOptions: (pluginOptions, razzleContext, webpackOptions) => {
    let nextLikeConfig = {
      i18n: {
        locales: null,
        defaultLocale: null,
      },
      pageExtensions: []
    };
    let nextLikeOptions = {
      defaultLoaders: {
        babel: webpackOptions.babelLoader,
      },
    };
    let webpackLikeConfig = {
      module: { rules: [] },
      plugins: [],
    };
    nextLikeConfig = withNextra(nextLikeConfig)
    webpackLikeConfig = nextLikeConfig.webpack(webpackLikeConfig, nextLikeOptions)
    return webpackOptions;
  },
  modifyConfig: (
    pluginOptions,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    if (webpackOptions.isWeb) {
      /*       webpackConfig?.module?.rules?.push(
        ...
        
      ); */
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
