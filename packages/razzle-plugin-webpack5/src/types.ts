import { Configuration } from "webpack";
import {
  BaseRazzleConfig,
  BaseRazzlePlugin,
  BaseRazzlePluginOptions,
  RazzleContext,
  RazzlePaths,
} from "../../razzle/src/types";

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
    webpackConfig: Configuration
  ) => Promise<Configuration> | Configuration;
}

export interface Webpack5Options {}

export type Webpack5RazzlePaths = "some" | "paths";

export interface Webpack5RazzleContext
  extends RazzleContext<RazzlePaths | Webpack5RazzlePaths> {}

export interface Webpack5PluginOptions {}

export type Webpack5RazzleConfigAlias =
  Webpack5RazzleConfig<Webpack5RazzleConfigAlias>;

export interface Webpack5RazzleConfig<
  T = Webpack5RazzleConfigAlias,
  Q = Webpack5Options,
  U = Webpack5RazzleContext
> extends BaseRazzleConfig<T, U>,
    BaseWebpack5RazzleConfig<T, U, Q> {}

export interface Webpack5RazzlePlugin<
  Q = Webpack5RazzleConfigAlias,
  U = Webpack5Options,
  T = Webpack5RazzleContext,
  W = Webpack5PluginOptions
> extends BaseRazzlePlugin<Q, T, W>,
    BaseWebpack5RazzlePlugin<Q, T, U> {}
