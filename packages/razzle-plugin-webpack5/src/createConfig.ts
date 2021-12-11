import path from "path";

import buildResolver from "esm-resolve";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import { logger } from "razzle";

import {
  Webpack5ChildConfig,
  Webpack5ChildPlugin,
  Webpack5Options,
  Webpack5PluginOptions,
  Webpack5RazzleContext,
} from "./types";

function resolveRequest(req, issuer) {
  const basedir =
    issuer.endsWith(path.posix.sep) || issuer.endsWith(path.win32.sep)
      ? issuer
      : path.dirname(issuer);
  const r = buildResolver(basedir);
  return r(req);
}
export default async (
  pluginOptions: Webpack5PluginOptions,
  razzleConfig: Webpack5ChildConfig,
  razzleContext: Webpack5RazzleContext,
  isDevServer: boolean = false,
  isDevEnv: boolean = false,
  isDev: boolean = false
): Promise<{
  configurations: Array<[Configuration, Webpack5Options]>;
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
  const webpackConfigs: Array<[Configuration, Webpack5Options]> = [];

  for (const buildName of [...allBuilds]) {
    const webOnly =
      webBuilds.some((build) => build === buildName) &&
      !nodeBuilds.some((build) => build === buildName);
    const nodeOnly =
      !webBuilds.some((build) => build === buildName) &&
      nodeBuilds.some((build) => build === buildName);

    shouldUseDevserver = shouldUseDevserver && !nodeOnly;

    if (!nodeOnly) {
      let webpackOptions: Webpack5Options = {
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
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
          webpackOptions = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions
          );
        }
      }
      if (razzleConfig.modifyWebpackOptions) {
        // Check if razzle.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        webpackOptions = await razzleConfig.modifyWebpackOptions(
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
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackConfig) {
          webpackConfig = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackConfig(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions,
            webpackConfig
          );
        }
      }
      if (razzleConfig.modifyWebpackConfig) {
        // Check if razzleConfig.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        webpackConfig = await razzleConfig.modifyWebpackConfig(
          razzleConfig,
          razzleContext,
          webpackOptions,
          webpackConfig
        );
      }
      webpackConfigs.push([webpackConfig, <Webpack5Options>webpackOptions]);
    }
    if (!webOnly) {
      let webpackOptions: Webpack5Options = {
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
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
          webpackOptions = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions
          );
        }
      }
      if (razzleConfig.modifyWebpackOptions) {
        // Check if razzle.modifyWebpackOptions is a function.
        // If it is, call it on the options we created.
        webpackOptions = await razzleConfig.modifyWebpackOptions(
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
      };

      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackConfig) {
          webpackConfig = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackConfig(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            webpackOptions,
            webpackConfig
          );
        }
      }
      if (razzleConfig.modifyWebpackConfig) {
        // Check if razzleConfig.modifyWebpackConfig is a function.
        // If it is, call it on the config we created.
        webpackConfig = await razzleConfig.modifyWebpackConfig(
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
      if ((<Webpack5ChildPlugin>plugin).modifyDevserverConfig) {
        devServerConfiguration = await (<Required<Webpack5ChildPlugin>>(
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
