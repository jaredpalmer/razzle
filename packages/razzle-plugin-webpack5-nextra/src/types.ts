import type { RuleSetRule } from "webpack";
import { types as Razzle } from "razzle";
import { types as WP5 } from "razzle-plugin-webpack5";
import { type } from "os";

export type Options = {};

export type Context = {};

export type PluginOptions = {}

export type Paths = {};

export type DefinePluginDefines = {};


export type Plugin = WP5.PluginInt<
  PluginOptions,
  Context & WP5.Context & Razzle.Context,
  Options &
    WP5.Options &
    WP5.DefineOptions<DefinePluginDefines & WP5.DefinePluginDefines>
>;
