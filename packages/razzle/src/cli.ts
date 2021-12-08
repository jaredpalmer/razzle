import yargs, { Argv } from "yargs";
import { hideBin } from "yargs/helpers";

import loadConfig from "./loaders/config.js";
import { RazzlePlugin, RazzleConfig, RazzleContext } from "./types";

export async function cli(): Promise<void>;
export async function cli() {
  const { razzleConfig, razzleContext } = await loadConfig();

  type PluginParser = (
    argv: Argv,
    pluginOptions: Record<string, unknown>,
    razzleConfig: RazzleConfig,
    razzleContext: RazzleContext
  ) => void;
  type ConfigParser = (
    argv: Argv,
    razzleConfig: RazzleConfig,
    razzleContext: RazzleContext
  ) => void;

  const parsers: Record<
    string,
    {
      options?: Record<string, unknown>;
      parser: PluginParser | ConfigParser;
    }
  > = {};
  for (const { plugin, options: chilPluginOptios } of razzleContext.plugins) {
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

  let argv = yargs(hideBin(process.argv))
    .scriptName("razzle")
    .option("d", {
      type: "boolean",
      alias: "debug",
      describe: "enable debug option",
    })
    .option("v", {
      type: "boolean",
      alias: "verbose",
      describe: "enable debug option",
    })

  for (const command in parsers) {
    if (parsers[command].options) {
      (<PluginParser>parsers[command].parser)(
        argv,
        <Record<string, unknown>>parsers[command].options,
        razzleConfig,
        razzleContext
      );
    } else {
      (<ConfigParser>parsers[command].parser)(
        argv,
        razzleConfig,
        razzleContext
      );
    }
  }
  argv.parse();
}
