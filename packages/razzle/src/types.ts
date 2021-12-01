import { Argv, Arguments } from "yargs";

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

export type RazzlePaths = Record<RazzlePathNames, string>;

export interface RazzleContext<U = RazzlePaths> {
  paths: RazzlePaths;
  razzleOptions: RazzleOptions;
  pluginsOptions: Record<string, unknown>;
}

export type RazzleConfig = BaseRazzleConfig<RazzleConfig>;

export interface BaseRazzleConfig<
  T extends BaseRazzleConfig = BaseRazzleConfig<RazzleConfig, RazzleContext>,
  U = RazzleContext
> {
  options?: RazzleOptions;
  plugins?: Array<
    | string
    | { name: string; options: BaseRazzlePluginOptions }
    | { plugin: BaseRazzlePlugin<T>; options: BaseRazzlePluginOptions }
  >;
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

export type RazzlePlugin = BaseRazzlePlugin<RazzleConfig>;

export interface BaseRazzlePluginOptions {}

export interface BaseRazzlePlugin<
  T extends BaseRazzleConfig = BaseRazzleConfig<RazzleConfig, RazzleContext>,
  U = RazzleContext,
  Q extends BaseRazzlePluginOptions = BaseRazzlePluginOptions
> {
  name: string;
  options?: Q;
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
/* 

interface BaseCustomRazzleConfig {
  try?: string;
}
interface CustomRazzleConfig extends BaseCustomRazzleConfig, BaseRazzleConfig {}

interface CustomRazzlePlugin extends BaseRazzlePlugin<CustomRazzleConfig> {
  try?: string;
}

const tryit3: CustomRazzlePlugin = {
  name: "custom",
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

const plugin = (
  options: BaseRazzlePluginOptions
): { plugin: CustomRazzlePlugin; options: BaseRazzlePluginOptions } => {
  return { plugin: tryit3, options: {} };
};

const tryit2: RazzlePlugin = {
  name: "try",
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

const tryit1: RazzleConfig = {
  plugins: [{ plugin: tryit2, options: {} }],
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

const tryit: RazzleConfig = {
  plugins: [{ plugin: tryit2, options: {} }, plugin({})],
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
 */