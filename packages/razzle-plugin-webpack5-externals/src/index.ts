
import { Webpack5ExternalsPluginOptions, Webpack5ExternalsRazzlePlugin } from "./types";
import defaultOptions from "./defaultOptions.js";

import path from "path";


export * from "./types.js";

const Plugin: Webpack5ExternalsRazzlePlugin = {
  name: "webpack5-externals",
  defaultOptions: defaultOptions,
  modifyRazzleContext: (pluginOptions, razzleContext) => {

    return razzleContext;
  }
};

export default function (options: Webpack5ExternalsPluginOptions): {
  plugin: Webpack5ExternalsRazzlePlugin;
  options: Webpack5ExternalsPluginOptions;
} {
  return {
    plugin: Plugin,
    options: { ...(Plugin.defaultOptions || {}), ...options },
  };
}
