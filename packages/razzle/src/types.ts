import { Arguments, Argv } from "yargs";

export type RazzleOptions = {
  verbose?: boolean;
  debug?: boolean;
};

export type RazzleConfigAtleastOne =
  | "modifyRazzleContext"
  | "addCommands"
  | "options";

export type RazzlePathNames =
  | "dotenv"
  | "appPath"
  | "appNodeModules"
  | "appPackageJson"
  | "appRazzleConfig"
  | "nodePaths"
  | "ownPath"
  | "ownNodeModules";

export type RazzlePaths<T extends string = RazzlePathNames> = Record<T, string>;

export interface RazzleContext<U = RazzlePaths> {
  paths: U;
  razzleOptions: RazzleOptions;
  plugins: Array<PluginWithOptions>;
}

export type RazzleConfig = BaseRazzleConfig<RazzleConfig>;

export interface BaseRazzleConfig<
  T = BaseRazzleConfig<RazzleConfig, RazzleContext>,
  U = RazzleContext
> {
  options?: RazzleOptions;
  plugins: Array<PluginUnion>;
  modifyRazzleContext?: (razzleContext: U) => Promise<U> | U;
  addCommands?: Record<
    string,
    {
      parser: (
        argv: Argv,
        razzleConfig: T,
        razzleContext: U,
        handler: (argv: Arguments) => void
      ) => Argv;
      handler: (razzleConfig: T, razzleContext: U) => (argv: Arguments) => void;
    }
  >;
}

export interface BaseRazzlePluginOptions {}

export type RazzlePlugin = BaseRazzlePlugin<
  BaseRazzlePluginOptions,
  RazzleConfig
>;

export interface BaseRazzlePlugin<
  Q,
  T = BaseRazzleConfig<RazzleConfig, RazzleContext>,
  U = RazzleContext
> {
  name: string;
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
