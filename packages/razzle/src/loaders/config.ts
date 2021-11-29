import { BaseRazzlePlugin, BaseRazzlePluginOptions, RazzleConfig, RazzleContext, RazzleOptions, RazzlePlugin } from "../types";
import fs from "fs-extra";
import logger from "../logger";
import defaultPaths from "../paths";
import setupEnvironment from "../env";
import loadPlugins from "./plugins";

export default (
  razzleConfigIn?: RazzleConfig | undefined,
  packageJsonIn?: unknown | undefined
): Promise<{ razzleConfig: RazzleConfig; razzleContext: RazzleContext }> =>
  new Promise(async (resolve) => {
    let razzleConfig: RazzleConfig = razzleConfigIn || {};
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

    let razzleContext: RazzleContext = <RazzleContext>{ paths: defaultPaths };

    const plugins: Array<{ plugin: BaseRazzlePlugin; options: BaseRazzlePluginOptions }> =
    await loadPlugins(razzleConfig.plugins);

    for (const {plugin, options: pluginOptions} of plugins) {
      // Check if plugin.modifyPaths is a function.
      // If it is, call it on the paths we created.
      if (plugin.modifyRazzleContext) {
        razzleContext = await plugin.modifyRazzleContext(
          pluginOptions,
          razzleOptions,
          razzleContext
        );
      }
    }
    if (razzleConfig.modifyRazzleContext) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      razzleContext = await razzleConfig.modifyRazzleContext(
        razzleOptions,
        razzleContext
      );
    }

    resolve({
      razzleConfig,
      razzleContext,
    });
  });
