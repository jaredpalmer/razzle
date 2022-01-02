import { types as Razzle } from "razzle";
import { types as WP5 } from "razzle-plugin-webpack5";
import { types as BL } from "razzle-plugin-webpack5-browserslist";

export interface PluginOptions {}

export type Paths = {};

export type Context = {};

export type Options = {
  babelLoader: { loader: string; options: Record<string, unknown> };
};

export type DefinePluginDefines = {};

export type Plugin = WP5.PluginInt<
  PluginOptions,
  Context &
    WP5.Context &
    BL.Context &
    Razzle.Context &
    Razzle.PathsContext<Paths & WP5.Paths & Razzle.Paths>,
  Options &
    WP5.Options &
    BL.Options &
    WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;
