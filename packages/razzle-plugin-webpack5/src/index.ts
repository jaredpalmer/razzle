import { Configuration } from "webpack";
import {
  BaseRazzleConfig,
  BaseRazzlePlugin,
  BaseRazzlePluginOptions,
  RazzleContext,
  RazzlePaths,
} from "../../razzle/src/types";

export interface BaseRazzleWebpack5Options {}

export interface BaseWebpack5RazzleConfig<T, U, Q> {
  modifyWebpackOptions?: (
    razzleConfig: T,
    razzleContext: U,
    webpackOptions: Q
  ) => Promise<Q> | Q;
  modifyWebpackConfig?: (
    razzleConfig: T,
    razzleContext: U,
    webpackOptions: Q,
    webpackConfig: Configuration
  ) => Promise<Configuration> | Configuration;
}

export interface BaseWebpack5RazzlePlugin<T, U, Q> {
  modifyWebpackOptions?: (
    razzleConfig: T,
    razzleContext: U,
    webpackOptions: Q
  ) => Promise<Q> | Q;
  modifyWebpackConfig?: (
    razzleConfig: T,
    razzleContext: U,
    webpackOptions: Q,
    webpackConfig: Configuration,
  ) => Promise<Configuration> | Configuration;
}

export type Webpack5RazzlePaths = "some" | "paths";

export interface Webpack5RazzleContext
  extends RazzleContext<RazzlePaths | Webpack5RazzlePaths> {}

export interface BaseWebpack5PluginOptions {}

export interface Webpack5PluginOptions
  extends BaseRazzlePluginOptions,
    BaseWebpack5PluginOptions {}

export type Webpack5RazzleConfigAlias =
  Webpack5RazzleConfig<Webpack5RazzleConfigAlias>;

export interface Webpack5RazzleConfig<T, U = Webpack5RazzleContext, Q = BaseRazzleWebpack5Options>
  extends BaseRazzleConfig<T, U>,
    BaseWebpack5RazzleConfig<T, U, Q> {}

export interface Webpack5RazzlePlugin
  extends BaseRazzlePlugin<
      Webpack5RazzleConfigAlias,
      Webpack5RazzleContext,
      Webpack5PluginOptions
    >,
    BaseWebpack5RazzlePlugin<
      Webpack5RazzleConfigAlias,
      Webpack5RazzleContext,
      BaseRazzleWebpack5Options
    > {}
