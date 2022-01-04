import { types as Razzle } from "razzle";
import { types as WP5 } from "razzle-plugin-webpack5";

export type Options = {};

export type Context = {
  pages: [string]
};

export type PluginOptions = {
}

export type Paths = {
  staticPath: string;
};

export type DefinePluginDefines = {};


export type Plugin = WP5.PluginInt<
  PluginOptions,
  Context & WP5.Context & Razzle.Context & Razzle.PathsContext<Paths & WP5.Paths & Razzle.Paths>,
  Options &
    WP5.Options &
    WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;
