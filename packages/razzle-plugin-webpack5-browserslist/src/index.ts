import path from "path";

import { PluginOptions, Plugin } from "./types";
import browserslist from "browserslist";

import type * as types from "./types";
export { types };

const plugin: Plugin = {
  name: "webpack5-browserslist",
  defaultOptions: {},
  modifyContext: (pluginOptions, razzleContext) => {

    let foundEnvs: Array<string> = [];

    const matrixNames = Object.keys(razzleContext.buildMatrix);

    for (const matrixName of matrixNames) {
      const buildConfig = razzleContext.buildMatrix[matrixName];
      const allTargets = buildConfig.targets;

      for (const buildTarget of allTargets) {
        try {
          browserslist(null, {
            env: `${matrixName}-${buildTarget}`,
            throwOnMissing: true,
          });
          foundEnvs.push(`${matrixName}-${buildTarget}`);
        } catch (error) {}
      }
    }
    razzleContext.browserslistEnvs = foundEnvs;
    return razzleContext;
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
