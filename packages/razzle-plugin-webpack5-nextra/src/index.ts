import {
  PluginOptions,
  Plugin,
} from "./types";
import withNextra from 'nextra'
import type * as types from "./types";
export { types }

const plugin: Plugin = {
  name: "webpack5-nextra",
  defaultOptions: {  },
  modifyOptions: (
    pluginOptions,
    razzleContext,
    webpackOptions
  ) => {
    
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
