import {
  PluginOptions,
  Plugin,
} from "./types";

import { collectPages } from "./utils.js";

import type * as types from "./types";
import { inspect } from 'util';
import path from "path";

const plugin: Plugin = {
  name: "webpack5-pages",
  defaultOptions: {
  },
  modifyContext: async (
    pluginOptions,
    razzleContext
  ) => {
    razzleContext.pages = await collectPages(path.join(razzleContext.paths.appPath, 'pages'), ['md', 'mdx'])
    console.log(inspect(razzleContext, false, 5, true));

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
