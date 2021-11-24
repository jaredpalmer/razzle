import { Argv } from "yargs";

export type RazzleOptions = {
  verbose?: boolean;
  debug?: boolean;
};

export type RazzleConfigAtleastOne =
  | "modifyRazzleContext"
  | "addCommands"
  | "options";

export type RazzlePaths =
  | "dotenv"
  | "appPath"
  | "appNodeModules"
  | "appPackageJson"
  | "appRazzleConfig"
  | "nodePaths"
  | "ownPath"
  | "ownNodeModules";

export interface RazzleContext<U = RazzlePaths> {
  paths: Record<keyof U, string>;
}

export interface BaseRazzleConfig<
  T extends BaseRazzleConfig<T, U>,
  U extends RazzleContext = RazzleContext
> {
  options?: RazzleOptions;
  modifyRazzleContext?: (razzleConfig: T, razzleContext: U) => Promise<U> | U;
  addCommands?: Record<
    string,
    {
      parser: (argv: Argv, razzleConfig: T, razzleContext: U, handler: (argv: Argv) => void) => Argv;
      handler: (razzleConfig: T, razzleContext: U) => (argv: Argv) => void;
    }
  >;
}

export interface BaseRazzlePluginOptions {}

export interface BaseRazzlePlugin<
  T extends BaseRazzleConfig<T, U>,
  U extends RazzleContext = RazzleContext,
  Q extends BaseRazzlePluginOptions = BaseRazzlePluginOptions
> {
  options?: Q;
  modifyRazzleContext?: (pluginOptions: Q, razzleConfig: T, razzleContext: U) => Promise<U> | U;
  addCommands?: Record<
    string,
    {
      parser: (argv: Argv, pluginOptions: Q, razzleConfig: T, razzleContext: U, handler: (argv: Argv) => void) => Argv;
      handler: (pluginOptions: Q, razzleConfig: T, razzleContext: U) => (argv: Argv) => void;
    }
  >;
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type RazzleConfigAlias = BaseRazzleConfig<RazzleConfigAlias>;

export type RazzlePluginAlias = BaseRazzlePlugin<RazzleConfigAlias>;

export type RazzlePlugin = RequireAtLeastOne<RazzlePluginAlias>;

export type RazzleConfig = RequireAtLeastOne<RazzleConfigAlias>;

const tryit: RazzleConfig = {
  addCommands: {
    build: {
      parser: (argv, razzleConfig, razzleContext, handler) => {
        return argv;
      },
      handler: (razzleConfig, razzleContext) => {
        return (argv) => {};
      },
    },
  },
};

const tryit2: RazzlePlugin = {
  addCommands: {
    build: {
      parser: (argv, pluginOptions, razzleConfig, razzleContext, handler) => {
        return argv;
      },
      handler: (pluginOptions, razzleConfig, razzleContext) => {
        return (argv) => {};
      },
    },
  },
};
