
import {
  ConfigInt as WP5ConfigInt,
  PluginInt as WP5PluginInt,
  ContextInt as WP5ContextInt,
  OptionsInt as WP5OptionsInt,
  PathNames as WP5PathNames,
  DefinePluginDefines as WP5DefinePluginDefines,
} from "razzle-plugin-webpack5";

export interface ExternalsContextInt<Pths extends string>
  extends WP5ContextInt<Pths> {}

export interface ExternalsOptionsInt<Defs extends string>
  extends WP5OptionsInt<Defs> {}

export interface PluginOptions {
  esmExternals: boolean | "loose";
  notExternalsCallback?: (request: string, context: string) => boolean;
}

export type PathNames =
  | WP5PathNames;

export type ExternalsContext =
  ExternalsContextInt<PathNames>;

export type ExternalsDefinePluginDefines =
  | WP5DefinePluginDefines;

export type ExternalsOptions =
  ExternalsOptionsInt<ExternalsDefinePluginDefines>;

export type ExternalsConfig = WP5ConfigInt<
  ExternalsContext,
  ExternalsOptions
>;

export type ExternalsPlugin = WP5PluginInt<
  PluginOptions,
  ExternalsConfig,
  ExternalsContext,
  ExternalsOptions
>;

