import path from "path";

import buildResolver from "esm-resolve";
import {
  PluginFunction,
  PluginNameWithOptions,
  PluginUnion,
  PluginWithOptions,
} from "../types";

export async function loadPlugin(
  configPath: string,
  plugin: PluginUnion
): Promise<PluginWithOptions> {
  const resolve = buildResolver(configPath);

  if (typeof plugin === "string") {
    // Apply the plugin with default options if passing only a string
    return await loadPlugin(configPath, { name: plugin, options: {} });
  }

  // Support for not released plugins without options
  // Use plugin.object if you need options
  if (typeof plugin === "object" && !(<PluginNameWithOptions>plugin).name) {
    return <PluginWithOptions>{ plugin: plugin, options: {} };
  }

  if (typeof (<PluginWithOptions>plugin).plugin === "object") {
    return <PluginWithOptions>plugin;
  }

  const isScopedPlugin =
    (<PluginNameWithOptions>(<unknown>plugin)).name.startsWith("@") &&
    (<PluginNameWithOptions>(<unknown>plugin)).name.includes("/");
  let scope;
  let scopedPluginName;
  if (isScopedPlugin) {
    const pluginNameParts = (<PluginNameWithOptions>(
      (<unknown>plugin)
    )).name.split("/");
    scope = pluginNameParts[0];
    scopedPluginName = pluginNameParts[1];
  }

  const completePluginNames = [
    isScopedPlugin && `${scope}/razzle-plugin-${scopedPluginName}`,
    isScopedPlugin && (<PluginNameWithOptions>plugin).name,
    `razzle-plugin-${(<PluginNameWithOptions>plugin).name}`,
    `${(<PluginNameWithOptions>plugin).name}/razzle-plugin`,
  ].filter(Boolean);
  
  // Try to find the plugin in node_modules
  let razzlePlugin: PluginFunction = null;
  const tried: Array<string> = [];
  console.log(completePluginNames);
  for (const completePluginName of <Array<string>>completePluginNames) {
    const resolved = resolve(completePluginName);
    if (resolved) {
      const tryPath = path.resolve(resolved);    console.log(tryPath);

      tried.push(tryPath)
      try {
        razzlePlugin = (await import(tryPath)).default;
      } catch (error) {
        console.log(error);
      }
    }
  }

  if (!razzlePlugin) {
    const last = completePluginNames.pop();
    const lastTried = tried.pop();
    throw new Error(
      `Unable to find '${completePluginNames.join("', '")}' or ${last}'` +
      tried.length && `Tried: ${tried.join("',\n '")}\n or ${lastTried}'`
    );
  }

  return <PluginWithOptions>razzlePlugin(plugin.options);
}

export default async (
  configPath: string,
  plugins: Array<PluginUnion>
): Promise<Array<PluginWithOptions>> => {
  return (
    (plugins &&
      (await Promise.all(
        plugins.map(async (plugin) => await loadPlugin(configPath, plugin))
      ))) ||
    []
  );
};
