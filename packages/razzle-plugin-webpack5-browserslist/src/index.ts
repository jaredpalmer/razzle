import path from "path";

import { PluginOptions, Plugin } from "./types";
import browserslist from "browserslist";

import type * as types from "./types";
export { types }

const plugin: Plugin = {
  name: "webpack5-browserslist",
  defaultOptions: {},
  modifyContext: (
    pluginOptions,
    razzleContext
  ) => {
    let foundEnvs: Array<string> = []
    for (const build of razzleContext.webBuilds) {
      try {
        browserslist(null, {env: `web-${build}`, throwOnMissing: true})
        foundEnvs.push(`web-${build}`)
      } catch (error) {
        
      }
    }
    for (const build of razzleContext.nodeBuilds) {
      try {
        browserslist(null, {env: `node-${build}`, throwOnMissing: true})
        foundEnvs.push(`node-${build}`)
      } catch (error) {
        
      }
    }
    razzleContext.browserslistEnvs = foundEnvs
    return razzleContext;
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
