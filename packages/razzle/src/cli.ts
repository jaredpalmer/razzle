import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import loadConfig from "./loaders/config.js";
import loadPlugins from "./loaders/plugins.js";
import { BaseRazzlePlugin, BaseRazzlePluginOptions } from "./types";

export async function cli(): Promise<void>;
export async function cli() {
  const { razzleConfig, razzleContext } = await loadConfig();

  const plugins: Array<{
    plugin: BaseRazzlePlugin;
    options: BaseRazzlePluginOptions;
  }> = await loadPlugins(razzleContext.paths.ownNodeModules, razzleConfig.plugins);

  const parsers = {};
  for (const { plugin } of plugins) {
    // Check if plugin.modifyPaths is a function.
    // If it is, call it on the paths we created.
    if (plugin.addCommands) {
      for (const command in plugin.addCommands) {
        parsers[command] = plugin.addCommands[command].parser;
      }
    }
  }
  if (razzleConfig.addCommands) {
    for (const command in razzleConfig.addCommands) {
      parsers[command] = razzleConfig.addCommands[command].parser;
    }
  }

  const handlers = {};
  for (const { plugin } of plugins) {
    // Check if plugin.modifyPaths is a function.
    // If it is, call it on the paths we created.
    if (plugin.addCommands) {
      for (const command in plugin.addCommands) {
        handlers[command] = plugin.addCommands[command].handler;
      }
    }
  }
  if (razzleConfig.addCommands) {
    for (const command in razzleConfig.addCommands) {
      handlers[command] = razzleConfig.addCommands[command].handler;
    }
  }

  let argv = yargs(hideBin(process.argv)).scriptName('razzle')

  for (const command in parsers) {
    argv = parsers[command](
      argv,
      razzleConfig,
      razzleContext,
      handlers[command](razzleConfig, razzleContext)
    );
  }
  argv.parse();
}
