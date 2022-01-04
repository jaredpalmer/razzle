import {
  PluginOptions,
  Plugin,
} from "./types";

import { collectPages } from "./utils";

import type * as types from "./types";
export { types }

const plugin: Plugin = {
  name: "webpack5-pages",
  defaultOptions: {
  },
  modifyContext: (
    pluginOptions,
    razzleContext
  ) => {
    return razzleContext;
  },
  modifyConfig: (
    pluginOptions,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
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
