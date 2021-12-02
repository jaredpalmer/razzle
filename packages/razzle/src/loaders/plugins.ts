import path from "path";

import buildResolver from "esm-resolve";

import {
  BaseRazzlePlugin,
  BaseRazzlePluginOptions,
  RazzleConfig,
  RazzleContext,
  RazzleOptions,
} from "../types.js";

type PluginWithOptions = {
  plugin: BaseRazzlePlugin;
  options: BaseRazzlePluginOptions;
};
type PluginNameWithOptions = {
  name: string;
  options: BaseRazzlePluginOptions;
};
type PluginName = string;

type PluginFunction =
  | ((options: BaseRazzlePluginOptions) => PluginWithOptions)
  | null;

export async function loadPlugin(
  configPath: string,
  plugin: PluginName | PluginNameWithOptions | PluginWithOptions
) {
  const r = buildResolver(configPath);

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
    (<PluginNameWithOptions>plugin).name.startsWith("@") &&
    (<PluginNameWithOptions>plugin).name.includes("/");
  let scope;
  let scopedPluginName;
  if (isScopedPlugin) {
    const pluginNameParts = (<PluginNameWithOptions>plugin).name.split("/");
    scope = pluginNameParts[0];
    scopedPluginName = pluginNameParts[1];
  }

  const completePluginNames = [
    isScopedPlugin && `${scope}/razzle-plugin-${scopedPluginName}`,
    isScopedPlugin && (<PluginNameWithOptions>plugin).name,
    `razzle-plugin-${(<PluginNameWithOptions>plugin).name}`,
    `${(<PluginNameWithOptions>plugin).name}/razzle-plugin`,
  ].filter((name) => name);

  // Try to find the plugin in node_modules
  let razzlePlugin: PluginFunction = null;
  const tried: Array<string> = [];
  for (const completePluginName of <Array<string>>completePluginNames) {
      const tryPath = path.resolve(<string>r(completePluginName));
      tried.push(tryPath);
      razzlePlugin = (await import(tryPath)).default;
      // eslint-disable-next-line no-empty
  }
  if (!razzlePlugin) {
    const last = completePluginNames.pop();
    const lastTried = tried.pop();
    throw new Error(
      `Unable to find '${completePluginNames.join("', '")}' or ${last}'
      Tried:  ${tried.join("',\n '")}\n or ${lastTried}'`
    );
  }

  return <PluginWithOptions>razzlePlugin(plugin.options);
}

export default async function (
  configPath: string,
  plugins:
    | Array<
        | string
        | { plugin: BaseRazzlePlugin; options: BaseRazzlePluginOptions }
        | { name: string; options: BaseRazzlePluginOptions }
      >
    | undefined
) {
  return (
    (plugins &&
      (await Promise.all(
        plugins.map(async (plugin) => await loadPlugin(configPath, plugin))
      ))) ||
    []
  );
}
