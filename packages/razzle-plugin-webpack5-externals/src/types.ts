
import {
  Webpack5RazzleConfigInt,
  Webpack5RazzlePluginInt,
  Webpack5RazzleContextInt,
  Webpack5OptionsInt,
  Webpack5RazzlePathNames,
  Webpack5DefinePluginDefines
} from "razzle-plugin-webpack5/types";

export interface Webpack5ExternalsRazzleContextInt<U extends string>{}



export interface Webpack5ExternalsOptionsInt<T extends string> {
}

export interface Webpack5ExternalsPluginOptions {
  useEsm: boolean;
}

export type Webpack5ExternalsRazzlePathNames =
  | Webpack5RazzlePathNames
  | "externals";

export type Webpack5ExternalsRazzleContext =
  Webpack5ExternalsRazzleContextInt<Webpack5RazzlePathNames>;

export type Webpack5ExternalsDefinePluginDefines = Webpack5DefinePluginDefines | "process.env.NODE_ENV";

export type Webpack5Options = Webpack5ExternalsOptionsInt<Webpack5ExternalsDefinePluginDefines>;

export type Webpack5RazzleConfig = RazzleConfigInt<
  Webpack5ChildConfig,
  Webpack5RazzleContext
>;

export type Webpack5RazzlePlugin = RazzlePluginInt<
  Webpack5PluginOptions,
  Webpack5ChildConfig,
  Webpack5RazzleContext
>;

export type Webpack5ChildConfig = Webpack5RazzleConfigInt<
  Webpack5ChildConfig,
  Webpack5RazzleContext,
  Webpack5Options
>;

export type Webpack5ChildPlugin = Webpack5RazzlePluginInt<
  Record<string, unknown>,
  Webpack5ChildConfig,
  Webpack5RazzleContext,
  Webpack5Options
>;
