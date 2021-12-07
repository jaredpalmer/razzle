import yargs, { Argv } from "yargs";
import { hideBin } from "yargs/helpers";

import loadConfig from "./loaders/config.js";
import loadPlugins from "./loaders/plugins.js";
import {
  RazzlePlugin,
  RazzleConfig,
  RazzleContext,
  PluginWithOptions,
} from "./types";

export async function cli(): Promise<void>;
export async function cli() {
  const { razzleConfig, razzleContext } = await loadConfig();

  const plugins: Array<PluginWithOptions> = await loadPlugins(
    razzleContext.paths.ownNodeModules,
    razzleConfig.plugins
  );

  type PluginParser = (
    argv: Argv,
    pluginOptions: Record<string, unknown>,
    razzleConfig: RazzleConfig,
    razzleContext: RazzleContext
  ) => Argv;
  type ConfigParser = (
    argv: Argv,
    razzleConfig: RazzleConfig,
    razzleContext: RazzleContext
  ) => Argv;

  const parsers: Record<
    string,
    {
      options?: Record<string, unknown>;
      parser: PluginParser | ConfigParser;
    }
  > = {};
  for (const { plugin, options: chilPluginOptios } of plugins) {
    // Check if plugin.addCommands is a object.
    // If it is, add all keys as a function to parsers.
    if ((<RazzlePlugin>plugin).addCommands) {
      for (const command in (<RazzlePlugin>plugin).addCommands) {
        parsers[command] = {
          options: chilPluginOptios,
          parser: (<Required<RazzlePlugin>>plugin).addCommands[command],
        };
      }
    }
  }
  if (razzleConfig.addCommands) {
    for (const command in razzleConfig.addCommands) {
      parsers[command] = {
        parser: razzleConfig.addCommands[command],
      };
    }
  }

  let argv = yargs(hideBin(process.argv)).scriptName("razzle");

  for (const command in parsers) {
    if (parsers[command].options) {
      argv = (<PluginParser>parsers[command].parser)(
        argv,
        <Record<string, unknown>>parsers[command].options,
        razzleConfig,
        razzleContext
      );
    } else {
      argv = (<ConfigParser>parsers[command].parser)(
        argv,
        razzleConfig,
        razzleContext
      );
    }
  }
  argv.parse();
}
