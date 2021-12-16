import { type } from "os";
import { types as Razzle } from "razzle";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

export interface ConfigInt<Ctx, WP5Opts> extends Razzle.ConfigInt<Ctx> {
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
  extends Razzle.PluginInt<Opts, Conf, Ctx> {
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

export type Context = {
  devBuild: string;
  webBuilds: Array<string>;
  nodeBuilds: Array<string>;
};

export type Options = {
  readonly isWeb: boolean;
  readonly isNode: boolean;
  readonly isDevEnv: boolean;
  readonly isDev: boolean;
  readonly isProd: boolean;
  outputEsm: boolean;
  buildName: string;
}

export interface DefineOptions<Defs> {
  definePluginOptions: Defs;
}

export interface PluginOptions {
  devBuild: string;
  webBuilds: Array<string>;
  nodeBuilds: Array<string>;
  outputEsm: boolean | { node: boolean; web: boolean };
}

export type Paths = {
  appSrc: string;
  appBuild: string;
  appBuildPublic: string;
  appServerIndex: string;
  appServerPath: string;
  appClientPath: string;
};

export type DefinePluginDefines = {
  "process.env.NODE_ENV": string;
};

export type Config = Razzle.ConfigInt<
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>
>;

export type Plugin = Razzle.PluginInt<
  PluginOptions,
  ChildConfig,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>
>;

/* basic types for hooks to adhere to */
export type ChildConfig = ConfigInt<
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>,
  Options & DefineOptions<DefinePluginDefines>
>;

export type ChildPlugin = PluginInt<
  Record<string, unknown>,
  ChildConfig,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>,
  Options & DefineOptions<DefinePluginDefines>
>;
