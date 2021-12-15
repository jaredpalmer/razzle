import {
  ConfigInt as WP5ConfigInt,
  PluginInt as WP5PluginInt,
  ContextInt as WP5ContextInt,
  OptionsInt as WP5OptionsInt,
  PathNames as WP5PathNames,
  DefinePluginDefines as WP5DefinePluginDefines,
} from "razzle-plugin-webpack5";

export interface ContextInt<Pths extends string> extends WP5ContextInt<Pths> {
  browserslistEnvs: Array<string>;
}

export interface OptionsInt<Defs extends string> extends WP5OptionsInt<Defs> {}

export interface PluginOptions {}

export type PathNames = WP5PathNames;

export type Context = ContextInt<PathNames>;

export type DefinePluginDefines = WP5DefinePluginDefines;

export type Options = OptionsInt<DefinePluginDefines>;

export type Config = WP5ConfigInt<Context, Options>;

export type Plugin = WP5PluginInt<PluginOptions, Config, Context, Options>;
