import path from "path";

import buildResolver from "esm-resolve";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import logger from "razzle/logger";

import { ChildPlugin, PluginOptions } from "./types";
import { devNull, type } from "os";

function resolveRequest(req: string, issuer: string) {
  const basedir =
    issuer.endsWith(path.posix.sep) || issuer.endsWith(path.win32.sep)
      ? issuer
      : path.dirname(issuer);
  const resolve = buildResolver(basedir);
  return resolve(req);
}

type Context = Parameters<Required<ChildPlugin>["modifyContext"]>[1];
type Options = Parameters<Required<ChildPlugin>["modifyOptions"]>[2];

export default async (
  pluginOptions: PluginOptions,
  razzleContext: Context,
  isDevServer: boolean = false,
  isDevEnv: boolean = false,
  isDev: boolean = false
): Promise<{
  configurations: Array<[Configuration, Options]>;
  devServerConfiguration?: DevServerConfiguration;
}> => {
  const devMatrixName = razzleContext.devMatrixName;
  let shouldUseDevserver = isDevServer;
  const webpackConfigs: Array<[Configuration, Options]> = [];

  const matrixNames = isDevEnv
    ? [devMatrixName]
    : Object.keys(razzleContext.buildMatrix);
    
  for (const matrixName in matrixNames) {
    const buildConfig = razzleContext.buildMatrix[matrixName];
    const allTargets = buildConfig.targets;

    const clientOnly =
      allTargets.some((build) => /client/.test(build)) &&
      !allTargets.some((build) => /server/.test(build));
    const serverOnly =
      !allTargets.some((build) => /client/.test(build)) &&
      allTargets.some((build) => /server/.test(build));

    shouldUseDevserver = shouldUseDevserver && !serverOnly;

    for (const buildTarget of allTargets) {
      const isServer = /server/.test(buildTarget);
      let webpackOptions: Options = {
        matrixName: devMatrixName,
        buildTarget: buildTarget,
        buildTargets: allTargets,
        buildOptions: buildConfig.buildOptions,
        buildName: `${devMatrixName}-${buildTarget}`,
        isDevEnv: isDevEnv,
        isDev: isDev,
        isProd: !isDev,
        isClient: !isServer,
        isServer: isServer,
        outputEsm:
          typeof pluginOptions.outputEsm == "boolean"
            ? pluginOptions.outputEsm
            : isServer
            ? pluginOptions.outputEsm.server
            : pluginOptions.outputEsm.client,
        definePluginOptions: { "process.env.NODE_ENV": "development" },
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        if ((<ChildPlugin>plugin).modifyOptions) {
          webpackOptions = await (<Required<ChildPlugin>>(
            (<unknown>plugin)
          )).modifyOptions(childPluginOptions, razzleContext, webpackOptions);
        }
      }

      let webpackConfig: Configuration = {
        name: webpackOptions.buildName,
        target: webpackOptions.outputEsm
          ? isServer
            ? "node"
            : ["web", "es2015"]
          : "web",
        // Path to your entry point. From this file Webpack will begin its work
        entry: isServer
          ? webpackOptions.isDevEnv
            ? razzleContext.paths.appServerIndex
            : razzleContext.paths.appServerPath
          : razzleContext.paths.appClientPath,

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: isServer
            ? razzleContext.paths.appBuild
            : razzleContext.paths.appBuildPublic,
          publicPath: "",
          filename: isServer ? "server.cjs" : "client.js",
          module: webpackOptions.outputEsm,
          chunkFormat: webpackOptions.outputEsm ? "module" : "commonjs",
          environment: {
            module: webpackOptions.outputEsm,
            dynamicImport: webpackOptions.outputEsm,
          },
        },

        experiments: {
          outputModule: webpackOptions.outputEsm,
        },
        // Default mode for Webpack is production.
        // Depending on mode Webpack will apply different things
        // on the final bundle.
        mode: isDevEnv ? "development" : "production",
        module: {
          rules: [],
        },
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        if ((<ChildPlugin>plugin).modifyConfig) {
          webpackConfig = await (<Required<ChildPlugin>>(
            (<unknown>plugin)
          )).modifyConfig(
            childPluginOptions,
            razzleContext,
            webpackOptions,
            webpackConfig
          );
        }
      }
      if (buildConfig.depends) {
        if (buildConfig.depends[buildTarget]) {
          const depends = (<Array<string>>[
            typeof buildConfig.depends[buildTarget] === "string"
              ? [buildConfig.depends[buildTarget]]
              : buildConfig.depends[buildTarget],
          ]).map((dep) =>
            /-/.test(dep) ? dep : `${devMatrixName}-${buildTarget}`
          );
          webpackConfig.dependencies = depends;
        }
      }
      webpackConfigs.push([webpackConfig, <Options>webpackOptions]);
    }
  }

  if (shouldUseDevserver) {
    let devServerConfiguration: DevServerConfiguration = {
      static: {
        directory: path.join(razzleContext.paths.appPath, "public"),
      },
      compress: true,
      client: {
        logging: "info",
      },
      port: 9000,
    };

    // run plugin/config hooks
    for (const {
      plugin,
      options: childPluginOptions,
    } of razzleContext.plugins) {
      // Check if plugin.modifyWebpackOptions is a function.
      // If it is, call it on the context we created.
      if ((<ChildPlugin>plugin).modifyDevserverConfig) {
        devServerConfiguration = await (<Required<ChildPlugin>>(
          (<unknown>plugin)
        )).modifyDevserverConfig(
          childPluginOptions,
          razzleContext,
          devServerConfiguration
        );
      }
    }
    return {
      configurations: webpackConfigs,
      devServerConfiguration: devServerConfiguration,
    };
  } else {
    return {
      configurations: webpackConfigs,
    };
  }
};
