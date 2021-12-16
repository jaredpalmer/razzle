import path from "path";

import buildResolver from "esm-resolve";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import logger from "razzle/logger";

import {
  ChildConfig,
  ChildPlugin,
  PluginOptions
} from "./types";
import { type } from "os";

function resolveRequest(req: string, issuer: string) {
  const basedir =
    issuer.endsWith(path.posix.sep) || issuer.endsWith(path.win32.sep)
      ? issuer
      : path.dirname(issuer);
  const resolve = buildResolver(basedir);
  return resolve(req);
}

type Context = Parameters<Required<ChildPlugin>['modifyContext']>[1]
type Options = Parameters<Required<ChildPlugin>['modifyOptions']>[3]

export default async (
  pluginOptions: PluginOptions,
  razzleConfig: ChildConfig,
  razzleContext: Context,
  isDevServer: boolean = false,
  isDevEnv: boolean = false,
  isDev: boolean = false
): Promise<{
  configurations: Array<[Configuration, Options]>;
  devServerConfiguration?: DevServerConfiguration;
}> => {
  const devBuild = razzleContext.devBuild;
  const webBuilds = razzleContext.webBuilds;
  const nodeBuilds = razzleContext.nodeBuilds;
  const allBuilds = new Set(
    [...webBuilds, ...nodeBuilds].filter(
      (build) => !isDevServer || build !== devBuild
    )
  );
  let shouldUseDevserver = isDevServer;
  const webpackConfigs: Array<[Configuration, Options]> = [];

  for (const buildName of [...allBuilds]) {
    const webOnly =
      webBuilds.some((build) => build === buildName) &&
      !nodeBuilds.some((build) => build === buildName);
    const nodeOnly =
      !webBuilds.some((build) => build === buildName) &&
      nodeBuilds.some((build) => build === buildName);

    shouldUseDevserver = shouldUseDevserver && !nodeOnly;

    if (!nodeOnly) {
      let webpackOptions: Options = {
        isWeb: true,
        isNode: false,
        isDevEnv: isDevEnv,
        isDev: isDev,
        isProd: !isDev,
        outputEsm:
          typeof pluginOptions.outputEsm == "boolean"
            ? pluginOptions.outputEsm
            : pluginOptions.outputEsm.web,
        buildName: buildName,
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
          webpackOptions = await (<Required<ChildPlugin>><unknown>(
            plugin
          )).modifyOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions
          );
        }
      }
      if (razzleConfig.modifyOptions) {
        // Check if razzle.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        webpackOptions = await razzleConfig.modifyOptions(
          razzleConfig,
          razzleContext,
          webpackOptions
        );
      }

      let webpackConfig: Configuration = {
        name: `web-${buildName}`,
        target: webpackOptions.outputEsm ? ["web", "es2015"] : "web",
        // Path to your entry point. From this file Webpack will begin its work
        entry: razzleContext.paths.appClientPath,

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: razzleContext.paths.appBuildPublic,
          publicPath: "",
          filename: "client.js",
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
          rules: []
        }
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        if ((<ChildPlugin>plugin).modifyConfig) {
          webpackConfig = await (<Required<ChildPlugin>><unknown>(
            plugin
          )).modifyConfig(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions,
            webpackConfig
          );
        }
      }
      if (razzleConfig.modifyConfig) {
        // Check if razzleConfig.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        webpackConfig = await razzleConfig.modifyConfig(
          razzleConfig,
          razzleContext,
          webpackOptions,
          webpackConfig
        );
      }
      webpackConfigs.push([webpackConfig, <Options>webpackOptions]);
    }
    if (!webOnly) {
      let webpackOptions: Options = {
        isWeb: false,
        isNode: true,
        isDevEnv: isDevEnv,
        isDev: isDev,
        isProd: !isDev,
        outputEsm:
          typeof pluginOptions.outputEsm == "boolean"
            ? pluginOptions.outputEsm
            : pluginOptions.outputEsm.node,
        buildName: buildName,
        definePluginOptions: { "process.env.NODE_ENV": "development" },
      };
      if (webpackOptions.outputEsm) {
        logger.warn(`ESM is partially supported in node with webpack. Outputting .cjs with requires for node-${buildName}`)
      }
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        if ((<ChildPlugin>plugin).modifyOptions) {
          webpackOptions = await (<Required<ChildPlugin>><unknown>(
            plugin
          )).modifyOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions
          );
        }
      }
      if (razzleConfig.modifyOptions) {
        // Check if razzle.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        webpackOptions = await razzleConfig.modifyOptions(
          razzleConfig,
          razzleContext,
          webpackOptions
        );
      }

      let webpackConfig: Configuration = {
        name: `node-${buildName}`,
        target: "node",
        // target: webpackOptions.outputEsm ? "es2020" : "node",
        // Path to your entry point. From this file Webpack will begin its work
        entry: razzleContext.paths.appServerPath,

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: razzleContext.paths.appBuild,
          publicPath: "",
          filename: `server.cjs`,
          /*
          filename: `server.${webpackOptions.outputEsm ? "" : "c"}js`, 
          */
          module: webpackOptions.outputEsm,
          chunkFormat: webpackOptions.outputEsm ? "module" : "commonjs",
          environment: {
            module: webpackOptions.outputEsm,
            // dynamicImport: webpackOptions.outputEsm,
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
          rules: []
        }
      };

      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        if ((<ChildPlugin>plugin).modifyConfig) {
          webpackConfig = await (<Required<ChildPlugin>><unknown>(
            plugin
          )).modifyConfig(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions,
            webpackConfig
          );
        }
      }
      if (razzleConfig.modifyConfig) {
        // Check if razzleConfig.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        webpackConfig = await razzleConfig.modifyConfig(
          razzleConfig,
          razzleContext,
          webpackOptions,
          webpackConfig
        );
      }
      if (!nodeOnly) {
        webpackConfig.dependencies = [`web-${buildName}`];
      }

      webpackConfigs.push([webpackConfig, webpackOptions]);
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
        devServerConfiguration = await (<Required<ChildPlugin>><unknown>(
          plugin
        )).modifyDevserverConfig(
          childPluginOptions,
          razzleConfig,
          razzleContext,
          devServerConfiguration
        );
      }
    }
    if (razzleConfig.modifyDevserverConfig) {
      // Check if razzle.modifyPaths is a function.
      // If it is, call it on the paths we created.
      devServerConfiguration = await razzleConfig.modifyDevserverConfig(
        razzleConfig,
        razzleContext,
        devServerConfiguration
      );
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
