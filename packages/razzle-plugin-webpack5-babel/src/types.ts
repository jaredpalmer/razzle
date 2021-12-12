
import {
  ConfigInt as WP5ConfigInt,
  PluginInt as WP5PluginInt,
  ContextInt as WP5ContextInt,
  OptionsInt as WP5OptionsInt,
  PathNames as WP5PathNames,
  DefinePluginDefines as WP5DefinePluginDefines,
} from "razzle-plugin-webpack5";

export interface BabelContextInt<Pths extends string>
  extends WP5ContextInt<Pths> {}

export interface BabelOptionsInt<Defs extends string>
  extends WP5OptionsInt<Defs> {}

export interface PluginOptions {
}

export type PathNames =
  | WP5PathNames;

export type BabelContext =
  BabelContextInt<PathNames>;

export type BabelDefinePluginDefines =
  | WP5DefinePluginDefines;

export type BabelOptions =
  BabelOptionsInt<BabelDefinePluginDefines>;

export type BabelConfig = WP5ConfigInt<
  BabelContext,
  BabelOptions
>;

export type BabelPlugin = WP5PluginInt<
  PluginOptions,
  BabelConfig,
  BabelContext,
  BabelOptions
>;

