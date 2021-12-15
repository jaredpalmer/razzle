import {
  ConfigInt as RazzleConfigInt,
  ContextInt as RazzleContextInt,
  PathNames as RazzlePathNames,
  PluginInt as RazzlePluginInt,
} from "razzle";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

export interface ConfigInt<Ctx, WP5Opts> extends RazzleConfigInt<Ctx> {
  modifyOptions?: (
    razzleConfig: this,
    razzleContext: Ctx,
    webpackOptions: WP5Opts
  ) => Promise<WP5Opts> | WP5Opts;
  modifyConfig?: (
    razzleConfig: this,
    razzleContext: Ctx,
    webpackOptions: WP5Opts,
    webpackConfig: Configuration
  ) => Promise<Configuration> | Configuration;
  modifyDevserverConfig?: (
    razzleConfig: this,
    razzleContext: Ctx,
    devServerConfig: DevServerConfiguration
  ) => Promise<DevServerConfiguration> | DevServerConfiguration;
}

export interface PluginInt<Opts, Conf, Ctx, WP5Opts>
  extends RazzlePluginInt<Opts, Conf, Ctx> {
  modifyOptions?: (
    pluginOptions: Opts,
    razzleConfig: Conf,
    razzleContext: Ctx,
    webpackOptions: WP5Opts
  ) => Promise<WP5Opts> | WP5Opts;
  modifyConfig?: (
    pluginOptions: Opts,
    razzleConfig: Conf,
    razzleContext: Ctx,
    webpackOptions: WP5Opts,
    webpackConfig: Configuration
  ) => Promise<Configuration> | Configuration;
  modifyDevserverConfig?: (
    pluginOptions: Opts,
    razzleConfig: Conf,
    razzleContext: Ctx,
    devServerConfig: DevServerConfiguration
  ) => Promise<DevServerConfiguration> | DevServerConfiguration;
}

export interface ContextInt<Pths extends string>
  extends RazzleContextInt<Pths> {
  devBuild: string;
  webBuilds: Array<string>;
  nodeBuilds: Array<string>;
}

export interface OptionsInt<T extends string> {
  readonly isWeb: boolean;
  readonly isNode: boolean;
  readonly isDevEnv: boolean;
  readonly isDev: boolean;
  readonly isProd: boolean;
  outputEsm: boolean;
  buildName: string;
  definePluginOptions: Record<T, string>;
}

export interface PluginOptions {
  devBuild: string;
  webBuilds: Array<string>;
  nodeBuilds: Array<string>;
  outputEsm: boolean | { node: boolean; web: boolean };
}

export type PathNames =
  | RazzlePathNames 
  | "appSrc"
  | "appBuild"
  | "appBuildPublic"
  | "appServerIndex"
  | "appServerPath"
  | "appClientPath";

export type Context = ContextInt<PathNames>;

export type DefinePluginDefines = "process.env.NODE_ENV";

export type Config = RazzleConfigInt<Context>;

export type Plugin = RazzlePluginInt<PluginOptions, ChildConfig, Context>;

export type Options = OptionsInt<DefinePluginDefines>;

/* basic types for hooks to adhere to */
export type ChildConfig = ConfigInt<Context, Options>;

export type ChildPlugin = PluginInt<
  Record<string, unknown>,
  ChildConfig,
  Context,
  Options
>;
