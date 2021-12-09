import type * as webpack from "webpack";

export interface RazzleWebpack5Options {
  hasJsxRuntime: boolean;
  hasReactRefresh: boolean;
  isServer: boolean;
  development: boolean;
  sourceMaps?: boolean | "inline" | "both" | null | undefined;
  overrides: any;
  caller: any;
  configFile: string | undefined;
  cwd: string;
}

export interface RazzleWebpack5LoaderContext
  extends webpack.LoaderContext<RazzleWebpack5Options> {
  target: string | [string, string];
}
