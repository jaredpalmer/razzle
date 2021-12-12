import type {RuleSetRule} from "webpack";

import {
  ConfigInt as WP5ConfigInt,
  PluginInt as WP5PluginInt,
  ContextInt as WP5ContextInt,
  OptionsInt as WP5OptionsInt,
  PathNames as WP5PathNames,
  DefinePluginDefines as WP5DefinePluginDefines,
} from "razzle-plugin-webpack5";

export interface AssetsContextInt<Pths extends string>
  extends WP5ContextInt<Pths> {}

export interface AssetsOptionsInt<Defs extends string>
  extends WP5OptionsInt<Defs> {}

export interface PluginOptions {
  assetResourceExclude: Exclude<RuleSetRule['exclude'], undefined>
  assetAutoTest: Exclude<RuleSetRule['test'], undefined>
  assetAutoSize: number
}

export type PathNames =
  | WP5PathNames
  | "staticPath";

export type AssetsContext =
  AssetsContextInt<PathNames>;

export type AssetsDefinePluginDefines =
  | WP5DefinePluginDefines;

export type AssetsOptions =
  AssetsOptionsInt<AssetsDefinePluginDefines>;

export type AssetsConfig = WP5ConfigInt<
  AssetsContext,
  AssetsOptions
>;

export type AssetsPlugin = WP5PluginInt<
  PluginOptions,
  AssetsConfig,
  AssetsContext,
  AssetsOptions
>;
