import type {RuleSetRule} from "webpack";

import {
  Webpack5RazzleConfigInt,
  Webpack5RazzlePluginInt,
  Webpack5RazzleContextInt,
  Webpack5OptionsInt,
  Webpack5RazzlePathNames,
  Webpack5DefinePluginDefines,
} from "razzle-plugin-webpack5/types";

export interface Webpack5AssetsRazzleContextInt<T extends string>
  extends Webpack5RazzleContextInt<T> {}

export interface Webpack5AssetsOptionsInt<T extends string>
  extends Webpack5OptionsInt<T> {}

export interface Webpack5AssetsPluginOptions {
  assetResourceExclude: Exclude<RuleSetRule['exclude'], undefined>
  assetAutoTest: Exclude<RuleSetRule['test'], undefined>
  assetAutoSize: number
}

export type Webpack5AssetsRazzlePathNames =
  | Webpack5RazzlePathNames
  | "staticPath";

export type Webpack5AssetsRazzleContext =
  Webpack5AssetsRazzleContextInt<Webpack5AssetsRazzlePathNames>;

export type Webpack5AssetsDefinePluginDefines =
  | Webpack5DefinePluginDefines
  | "process.env.something";

export type Webpack5AssetsOptions =
  Webpack5AssetsOptionsInt<Webpack5AssetsDefinePluginDefines>;

export type Webpack5AssetsConfig = Webpack5RazzleConfigInt<
  Webpack5AssetsConfig,
  Webpack5AssetsRazzleContext,
  Webpack5AssetsOptions
>;

export type Webpack5AssetsRazzlePlugin = Webpack5RazzlePluginInt<
  Webpack5AssetsPluginOptions,
  Webpack5AssetsConfig,
  Webpack5AssetsRazzleContext,
  Webpack5AssetsOptions
>;
