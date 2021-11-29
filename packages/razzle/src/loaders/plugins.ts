import resolve from "resolve";

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

export async function loadPlugin(
  plugin: PluginName | PluginNameWithOptions | PluginWithOptions
) {
  if (typeof plugin === "string") {
    // Apply the plugin with default options if passing only a string
    return await loadPlugin({ name: plugin, options: {} });
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
  ].filter(Boolean);

  // Try to find the plugin in node_modules
  let razzlePlugin: BaseRazzlePlugin | null = null;
  for (const completePluginName of <Array<string>>completePluginNames) {
    try {
      razzlePlugin = await import(completePluginName);
      // eslint-disable-next-line no-empty
    } catch (error) {}

    if (razzlePlugin) {
      break;
    }
  }
  if (!razzlePlugin) {
    const last = completePluginNames.pop();
    throw new Error(
      `Unable to find '${completePluginNames.join("', '")}' or ${last}'`
    );
  }

  return <PluginWithOptions>{ plugin: razzlePlugin, options: plugin.options };
}

export default async function (
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
        plugins.map(async (plugin) => await loadPlugin(plugin))
      ))) ||
    []
  );
}
