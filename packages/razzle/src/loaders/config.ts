import { RazzleConfigAlias, RazzleContext, RazzleOptions } from "../types";
import fs from "fs-extra";
import logger from "../logger";
import defaultPaths from "../paths";
import setupEnvironment from "../env";
import loadPlugins from "./plugins";

export default (
  razzleConfigIn?: RazzleConfigAlias | undefined,
  packageJsonIn?: unknown | undefined
): Promise<{ razzle: RazzleConfigAlias; razzleContext: RazzleContext }> =>
  new Promise(async (resolve) => {
    let razzleConfig: RazzleConfigAlias = razzleConfigIn || {};
    let packageJson = packageJsonIn || {};
    // Check for razzle.config.js file
    if (fs.existsSync(defaultPaths.appRazzleConfig)) {
      try {
        razzleConfig = await import(defaultPaths.appRazzleConfig);
      } catch (e) {
        logger.error("Invalid razzle.config.js file.", e);
        process.exit(1);
      }
    }
    if (fs.existsSync(defaultPaths.appPackageJson)) {
      try {
        packageJson = JSON.parse(fs.readFileSync(defaultPaths.appPackageJson).toString());
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

    const razzleContext: RazzleContext = <RazzleContext>{ paths: defaultPaths };
  
    const plugins = razzleConfig.plugins && Array.isArray(razzleConfig.plugins)
      ? loadPlugins(razzleConfig.plugins, razzleContext)
      : [];

    for (const [plugin, pluginOptions] of plugins) {
      // Check if plugin.modifyPaths is a function.
      // If it is, call it on the paths we created.
      if (plugin.modifyPaths) {
        paths = await plugin.modifyPaths({
          options: {
            razzleOptions,
            pluginOptions,
          },
          paths,
        });
      }
    }
    if (razzleConfig.modifyRazzleContext) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      razzleContext = await razzle.modifyRazzleContext();
    }

    resolve({
      razzleConfig,
      razzleContext,
    });
  });
