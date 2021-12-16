import { Argv } from "yargs";

export type Options = {
  verbose?: boolean;
  debug?: boolean;
};

export type Paths = {
  dotenv: string;
  appPath: string;
  appNodeModules: string;
  appPackageJson: string;
  appConfig: string;
  nodePaths: string;
  ownPath: string;
  ownNodeModules: string;
};

export type Context = {
  razzleOptions: Options;
  plugins: Array<PluginWithOptions>;
};

export type PathsContext<Pths> = {
  paths: Pths;
};

export type Config = ConfigInt<Context & PathsContext<Paths>>;

export interface ConfigInt<Ctx> {
  options?: Options;
  plugins: Array<PluginUnion>;
  modifyContext?: (razzleContext: Ctx) => Promise<Ctx> | Ctx;
  addCommands?: Record<
    string,
    (argv: Argv, razzleConfig: this, razzleContext: Ctx) => void
  >;
}

export type Plugin = PluginInt<Record<string, unknown>, Config, Context & PathsContext<Paths>>;

export interface PluginInt<Opt, Conf, Ctx> {
  name: string;
  defaultOptions?: Opt;
  modifyContext?: (
    pluginOptions: Opt,
    razzleContext: Ctx
  ) => Promise<Ctx> | Ctx;
  addCommands?: Record<
    string,
    (
      argv: Argv,
      pluginOptions: Opt,
      razzleConfig: Conf,
      razzleContext: Ctx
    ) => void
  >;
}

export type PluginWithOptions = {
  plugin: Plugin;
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
