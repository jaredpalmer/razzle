import { Configuration } from "webpack";
import loadPlugins from "razzle/loaders/plugins";

import {
  Webpack5PluginOptions,
  Webpack5RazzlePlugin,
} from "./types";
import path from "path";

const Plugin: Webpack5RazzlePlugin = {
  name: "webpack5",
  modifyRazzleContext: (pluginOptions, razzleContext) => {
    const {
      paths: { appPath },
    } = razzleContext;
    const srcPath = path.join(appPath, "src");

    razzleContext.paths = {
      ...razzleContext.paths,
      srcPath: srcPath,
      appServerIndex: path.join(srcPath, "index"),
      appServerPath: path.join(srcPath, "server"),
      appClientPath: path.join(srcPath, "client"),
    };

    razzleContext = {
      ...razzleContext,
      webBuilds: pluginOptions.webBuilds,
      nodeBuilds: pluginOptions.nodeBuilds
    };
    return razzleContext;
  },
  addCommands: {
    start: (argv, pluginOptions, razzleConfig, razzleContext) => {
      return argv.command(
        "start",
        "start the webpack devserver",
        function (yargs) {
          return yargs.option("u", {
            alias: "url",
            describe: "the URL to open",
          });
        },
        async (argv) => {}
      );
    },
    build: (argv, pluginOptions, razzleConfig, razzleContext) => {
      return argv;
    },
  },
};

export default function (options: Webpack5PluginOptions): {
  plugin: Webpack5RazzlePlugin;
  options: Webpack5PluginOptions;
} {
  return { plugin: Plugin, options: options };
}
