import { Argv } from "yargs";

export type RazzleOptions = {
  verbose?: boolean;
  debug?: boolean;
};

export type RazzlePathNames =
  | "dotenv"
  | "appPath"
  | "appNodeModules"
  | "appPackageJson"
  | "appRazzleConfig"
  | "nodePaths"
  | "ownPath"
  | "ownNodeModules";

export type RazzlePaths<T extends string = string> = Record<T, string>;

export interface RazzleContextInt<U extends string> {
  paths: RazzlePaths<U>;
  razzleOptions: RazzleOptions;
  plugins: Array<PluginWithOptions>;
}

export type RazzleContext<T extends string = string> = RazzleContextInt<T>;

export type RazzleConfig = RazzleConfigInt<RazzleConfig, RazzleContext<RazzlePathNames>>;

export interface RazzleConfigInt<T, U extends RazzleContext> {
  options?: RazzleOptions;
  plugins: Array<PluginUnion>;
  modifyRazzleContext?: (razzleContext: U) => Promise<U> | U;
  addCommands?: Record<
    string,
    (argv: Argv, razzleConfig: T, razzleContext: U) => Argv
  >;
}

export type RazzlePlugin = RazzlePluginInt<Record<string, unknown>, RazzleConfig, RazzleContext<RazzlePathNames>>;

export interface RazzlePluginInt<Q, T, U> {
  name: string;
  defaultOptions?: Q;
  modifyRazzleContext?: (pluginOptions: Q, razzleContext: U) => Promise<U> | U;
  addCommands?: Record<
    string,
    (argv: Argv, pluginOptions: Q, razzleConfig: T, razzleContext: U) => Argv
  >;
}

export type PluginWithOptions = {
  plugin: unknown;
  options: Record<string, unknown>;
};
export type PluginNameWithOptions = {
  name: string;
  options: Record<string, unknown>;
};
export type PluginName = string;

export type PluginFunction =
  | ((options: Record<string, unknown>) => PluginWithOptions)
  | null;

export type PluginUnion =
  | PluginName
  | PluginWithOptions
  | PluginNameWithOptions;
