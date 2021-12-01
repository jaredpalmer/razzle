import { arch } from "os";
import { argv } from "process";
import {
  BaseWebpack5RazzlePlugin,
  Webpack5PluginOptions,
  Webpack5RazzleContext,
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
        return (argv) => {
          console.log("start"+ argv.u);
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
