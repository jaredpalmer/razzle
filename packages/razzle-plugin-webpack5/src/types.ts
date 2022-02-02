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
  devMatrixName: string;
  buildMatrix: Record<string, BuildConfig>;
};

export type Options = {
  matrixName: string,
  buildTargets: Array<string>,
  buildTarget: string,
  buildOptions?: BuildOptions,
  buildName: string,
  isDevEnv: boolean;
  isDev: boolean;
  isProd: boolean;
  outputEsm: boolean;
}

export type BuildOptions = Record<string, unknown>;

export type BuildConfig = {
  targets: Array<string>,
  depends?: Record<string, Array<string> | string>,
  buildOptions?: BuildOptions
}

export interface PluginOptions {
  devMatrixName: string;
  buildMatrix: Record<string, BuildConfig>;
  outputEsm: boolean | { server: boolean; client: boolean };
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


export interface DefineOptions<Defs> {
  definePluginOptions: Defs;
}

export type Plugin = Razzle.PluginInt<
  PluginOptions,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>
>;

export type ChildPlugin = PluginInt<
  Record<string, unknown>,
  Context & Razzle.Context & Razzle.PathsContext<Paths & Razzle.Paths>,
  Options & DefineOptions<DefinePluginDefines>
>;
