import type { RuleSetRule } from "webpack";
import { types as Razzle } from "razzle";
import { types as WP5 } from "razzle-plugin-webpack5";
import { types as BABEL } from "razzle-plugin-webpack5-babel";

export type Options = {};

export type Context = {};

export type PluginOptions = {}

export type Paths = {};

export type DefinePluginDefines = {};


export type Plugin = WP5.PluginInt<
  PluginOptions,
  Context & WP5.Context & Razzle.Context & Razzle.PathsContext<Paths & WP5.Paths & Razzle.Paths>,
  Options &
    WP5.Options & BABEL.Options &
    WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;
