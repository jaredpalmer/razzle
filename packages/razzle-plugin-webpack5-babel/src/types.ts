import { types as Razzle } from "razzle";
import { types as WP5 } from "razzle-plugin-webpack5";

export interface PluginOptions {
}

export type Paths = {}

export type Context = {}

export type Options = {}

export type DefinePluginDefines = {}

export type Config = WP5.ConfigInt<
  Context & WP5.Context & Razzle.Context & Razzle.PathsContext<Paths & WP5.Paths & Razzle.Paths>,
  Options & WP5.Options & WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;

export type Plugin = WP5.PluginInt<
  PluginOptions,
  Config,
  Context & WP5.Context & Razzle.Context & Razzle.PathsContext<Paths & WP5.Paths & Razzle.Paths>,
  Options & WP5.Options & WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;

