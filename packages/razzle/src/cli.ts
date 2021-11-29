import loadConfig from "./loaders/config";
import loadPlugins from "./loaders/plugins";

import { BaseRazzlePlugin, BaseRazzlePluginOptions } from "./types";

export async function cli(): Promise<void>;
export async function cli() {
  const {
    razzleConfig,
    razzleContext,
    razzleOptions
  } = await loadConfig();

  const plugins: Array<{ plugin: BaseRazzlePlugin; options: BaseRazzlePluginOptions }> =
  await loadPlugins(razzleConfig.plugins);

  const handlers = {};
  for (const {plugin, options: pluginOptions} of plugins) {
    // Check if plugin.modifyPaths is a function.
    // If it is, call it on the paths we created.
    if (plugin.addCommands) {
      for (const command in plugin.addCommands){
        handlers[command] = plugin.addCommands[command].handler;
      }
    }
  }
  if (razzleConfig.addCommands) {
    for (const command in razzleConfig.addCommands){
      handlers[command] = razzleConfig.addCommands[command].handler;
    }
  }

  const parsers = {};
  for (const {plugin, options: pluginOptions} of plugins) {
    // Check if plugin.modifyPaths is a function.
    // If it is, call it on the paths we created.
    if (plugin.addCommands) {
      for (const command in plugin.addCommands){
        parsers[command] = plugin.addCommands[command].parser;
      }
    }
  }
  if (razzleConfig.addCommands) {
    for (const command in razzleConfig.addCommands){
      parsers[command] = razzleConfig.addCommands[command].parser;
    }
  }

}
