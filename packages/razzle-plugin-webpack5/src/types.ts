import { type } from "os";
import { types as Razzle } from "razzle";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

export interface PluginInt<Opts, Ctx, WP5Opts>
  extends Razzle.PluginInt<Opts, Ctx> {
  modifyOptions?: (
    pluginOptions: Opts,
    razzleContext: Ctx,
    webpackOptions: WP5Opts
  ) => Promise<WP5Opts> | WP5Opts;
  modifyConfig?: (
    pluginOptions: Opts,
    razzleContext: Ctx,
    webpackOptions: WP5Opts,
    webpackConfig: Configuration
  ) => Promise<Configuration> | Configuration;
  modifyDevserverConfig?: (
    pluginOptions: Opts,
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

export type Plugin = Razzle.PluginInt<
  PluginOptions,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>
>;


export type ChildPlugin = PluginInt<
  Record<string, unknown>,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>,
  Options & DefineOptions<DefinePluginDefines>
>;
