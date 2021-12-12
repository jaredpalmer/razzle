import { Argv } from "yargs";

export type Options = {
  verbose?: boolean;
  debug?: boolean;
};

export type PathNames =
  | "dotenv"
  | "appPath"
  | "appNodeModules"
  | "appPackageJson"
  | "appConfig"
  | "nodePaths"
  | "ownPath"
  | "ownNodeModules";

export type Paths<T extends string = string> = Record<T, string>;

export interface ContextInt<Pths extends string> {
  paths: Paths<Pths>;
  razzleOptions: Options;
  plugins: Array<PluginWithOptions>;
}

export type Context = ContextInt<PathNames>;

export type Config = ConfigInt<Context>;

export interface ConfigInt<Ctx> {
  options?: Options;
  plugins: Array<PluginUnion>;
  modifyContext?: (razzleContext: Ctx) => Promise<Ctx> | Ctx;
  addCommands?: Record<
    string,
    (argv: Argv, razzleConfig: this, razzleContext: Ctx) => void
  >;
}

export type Plugin = PluginInt<Record<string, unknown>, Config, Context>;

export interface PluginInt<Opt, Conf, Ctx> {
  name: string;
  defaultOptions?: Opt;
  modifyContext?: (pluginOptions: Opt, razzleContext: Ctx) => Promise<Ctx> | Ctx;
  addCommands?: Record<
    string,
    (argv: Argv, pluginOptions: Opt, razzleConfig: Conf, razzleContext: Ctx) => void
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
