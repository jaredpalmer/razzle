import { Configuration } from "webpack";
import loadPlugins from "razzle/loaders/plugins.js";

import {
  Webpack5Options,
  Webpack5PluginOptions,
  Webpack5RazzlePlugin,
} from "./types";

const Plugin: Webpack5RazzlePlugin = {
  name: "webpack5",
  addCommands: {
    start: {
      parser: (argv, razzleConfig, razzleContext, handler) => {
        return argv.command(
          "start",
          "start the webpack devserver",
          function (yargs) {
            return yargs.option("u", {
              alias: "url",
              describe: "the URL to open",
            });
          },
          handler
        );
      },
      handler: (razzleConfig, razzleContext) => {
        return async (argv) => {
          let devBuild = "default";
          let webBuilds = ["default"];
          let nodeBuilds = ["default"];
          let webOnly =
            webBuilds.some((build) => build == devBuild) &&
            !nodeBuilds.some((build) => build == devBuild);
          let nodeOnly =
            !webBuilds.some((build) => build == devBuild) &&
            nodeBuilds.some((build) => build == devBuild);
          let webpackConfigs: Array<Configuration> = [];

          //  let devserverConfig:

          const plugins: Array<{
            plugin: Webpack5RazzlePlugin;
            options: Webpack5PluginOptions;
          }> = await loadPlugins(
            razzleContext.paths.ownNodeModules,
            razzleConfig.plugins
          );

          if (!nodeOnly) {
            let webpackConfig: Configuration = { name: `web-${devBuild}` };
            let webpackOptions: Webpack5Options = {isWeb: true, isNode: false, isServerless: false};
            // run plugin/config hooks
            webpackConfigs.push(webpackConfig);
          }
          if (!webOnly) {
            let webpackConfig: Configuration = { name: `node-${devBuild}` };
            let webpackOptions: Webpack5Options = {isWeb: false, isNode: true, isServerless: false};
            // run plugin/config hooks
            if (!nodeOnly) {
              webpackConfig.dependencies = [`web-${devBuild}`];
            }
            webpackConfigs.push(webpackConfig);
          }
          if (!nodeOnly) {
            // start devserver
          } else {
            // start watching
          }
        };
      },
    },
    build: {
      parser: (argv, razzleConfig, razzleContext) => {
        return argv;
      },
      handler: (razzleConfig, razzleContext) => {
        return (argv) => {};
      },
    },
  },
};

export default function (options: Webpack5PluginOptions): {
  plugin: Webpack5RazzlePlugin;
  options: Webpack5PluginOptions;
} {
  return { plugin: Plugin, options: options };
}
