import fs from "fs";

import setupEnvironment from "../env.js";
import logger from "../logger.js";
import defaultPaths from "../paths.js";
import {
  BaseRazzlePlugin,
  BaseRazzlePluginOptions,
  RazzleConfig,
  RazzleContext,
  RazzleOptions,
  RazzlePlugin,
} from "../types.js";

import loadPlugins from "./plugins.js";

export default (
  razzleConfigIn?: RazzleConfig | undefined,
  packageJsonIn?: unknown | undefined
): Promise<{ razzleConfig: RazzleConfig; razzleContext: RazzleContext }> =>
  new Promise(async (resolve) => {
    let razzleConfig: RazzleConfig = razzleConfigIn || {};
    let packageJson = packageJsonIn || {};
    // Check for razzle.config.js file
    if (fs.existsSync(defaultPaths.appRazzleConfig + ".js")) {
      try {
        razzleConfig = (await import(defaultPaths.appRazzleConfig + ".js"))
          .default;
      } catch (e) {
        logger.error("Invalid razzle.config.js file.", e);

        process.exit(1);
      }
    }
    if (fs.existsSync(defaultPaths.appPackageJson)) {
      try {
        packageJson = JSON.parse(
          fs.readFileSync(defaultPaths.appPackageJson).toString()
        );
      } catch (e) {
        logger.error("Invalid package.json.", e);
        process.exit(1);
      }
    }

    setupEnvironment(defaultPaths);

    const razzleOptions: RazzleOptions = Object.assign(
      <RazzleOptions>{ verbose: false, debug: false },
      razzleConfig.options || {}
    );

    let razzleContext: RazzleContext = {
      paths: defaultPaths,
      razzleOptions: razzleOptions,
      pluginsOptions: {},
    };

    const plugins: Array<{
      plugin: BaseRazzlePlugin;
      options: BaseRazzlePluginOptions;
    }> = await loadPlugins(
      razzleContext.paths.ownNodeModules,
      razzleConfig.plugins
    );

    for (const { plugin, options: pluginOptions } of plugins) {
      // Check if plugin.modifyRazzleContext is a function.
      // If it is, call it on the context we created.
      razzleContext.pluginsOptions[plugin.name] = pluginOptions;
      if (plugin.modifyRazzleContext) {
        razzleContext = await plugin.modifyRazzleContext(razzleContext);
      }
    }
    if (razzleConfig.modifyRazzleContext) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      razzleContext = await razzleConfig.modifyRazzleContext(razzleContext);
    }

    resolve({
      razzleConfig,
      razzleContext,
    });
  });
