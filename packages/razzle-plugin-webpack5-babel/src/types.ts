import { types as WP5 } from "razzle-plugin-webpack5";

export interface ContextInt<Pths extends string>
  extends WP5.ContextInt<Pths> {}

export interface OptionsInt<Defs extends string>
  extends WP5.OptionsInt<Defs> {}

export interface PluginOptions {
}

export type PathNames =
  | WP5.PathNames;

export type Context =
  ContextInt<PathNames>;

export type DefinePluginDefines =
  | WP5.DefinePluginDefines;

export type Options =
  OptionsInt<DefinePluginDefines>;

export type Config = WP5.ConfigInt<
  Context,
  Options
>;

export type Plugin = WP5.PluginInt<
  PluginOptions,
  Config,
  Context,
  Options
>;

