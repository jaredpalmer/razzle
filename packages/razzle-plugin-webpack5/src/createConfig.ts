import { Configuration } from "webpack";
import {
  Webpack5RazzleContext,
  Webpack5PluginOptions,
  Webpack5Options,
  Webpack5ChildPlugin,
  Webpack5ChildConfig,
} from "./types";

export default async (
  pluginOptions: Webpack5PluginOptions,
  razzleConfig: Webpack5ChildConfig,
  razzleContext: Webpack5RazzleContext
): Promise<Array<Configuration>> => {
  let devBuild = razzleContext.devBuild;
  let webBuilds = razzleContext.webBuilds;
  let nodeBuilds = razzleContext.nodeBuilds;
  let webOnly =
    webBuilds.some((build) => build == devBuild) &&
    !nodeBuilds.some((build) => build == devBuild);
  let nodeOnly =
    !webBuilds.some((build) => build == devBuild) &&
    nodeBuilds.some((build) => build == devBuild);
  let webpackConfigs: Array<Configuration> = [];

  //  let devserverConfig:

  if (!nodeOnly) {
    let webpackConfig: Configuration = { name: `web-${devBuild}` };
    let webpackOptions: Partial<Webpack5Options> = {
      isWeb: true,
      isNode: false,
      buildName: devBuild,
    };
    // run plugin/config hooks
    for (const {
      plugin,
      options: childPluginOptions,
    } of razzleContext.plugins) {
      // Check if plugin.modifyWebpackOptions is a function.
      // If it is, call it on the context we created.
      if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
        webpackOptions = await (<Required<Webpack5ChildPlugin>>(
          plugin
        )).modifyWebpackOptions(
          childPluginOptions,
          razzleConfig,
          razzleContext,
          <Webpack5Options>webpackOptions
        );
      }
    }
    if (razzleConfig.modifyWebpackOptions) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      webpackOptions = await razzleConfig.modifyWebpackOptions(
        razzleConfig,
        razzleContext,
        <Webpack5Options>webpackOptions
      );
    }

    webpackConfigs.push(webpackConfig);
  }
  if (!webOnly) {
    let webpackConfig: Configuration = { name: `node-${devBuild}` };

    let webpackOptions: Partial<Webpack5Options> = {
      isWeb: true,
      isNode: false,
      buildName: devBuild,
    };
    // run plugin/config hooks
    for (const {
      plugin,
      options: childPluginOptions,
    } of razzleContext.plugins) {
      // Check if plugin.modifyWebpackOptions is a function.
      // If it is, call it on the context we created.
      if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
        webpackOptions = await (<Required<Webpack5ChildPlugin>>(
          plugin
        )).modifyWebpackOptions(
          childPluginOptions,
          razzleConfig,
          razzleContext,
          <Webpack5Options>webpackOptions
        );
      }
    }
    if (razzleConfig.modifyWebpackOptions) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      webpackOptions = await razzleConfig.modifyWebpackOptions(
        razzleConfig,
        razzleContext,
        <Webpack5Options>webpackOptions
      );
    }
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
  return webpackConfigs;
};
