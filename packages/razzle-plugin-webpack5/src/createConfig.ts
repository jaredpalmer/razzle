import path from "path";
import { Configuration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";

import {
  Webpack5RazzleContext,
  Webpack5PluginOptions,
  Webpack5Options,
  Webpack5ChildPlugin,
  Webpack5ChildConfig,
} from "./types";

import buildResolver from "esm-resolve";

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
  isDevServer: boolean = false
): Promise<{
  configurations: Array<[Configuration, Webpack5Options]>;
  devServerConfiguration?: DevServerConfiguration;
}> => {
  let devBuild = razzleContext.devBuild;
  let webBuilds = razzleContext.webBuilds;
  let nodeBuilds = razzleContext.nodeBuilds;
  let allBuilds = new Set(
    [...webBuilds, ...nodeBuilds].filter(
      (build) => isDevServer && build !== devBuild
    )
  );
  console.log(Array.from(allBuilds));
  let shouldUseDevserver = isDevServer;
  let webpackConfigs: Array<[Configuration, Webpack5Options]> = [];

  for (const buildName in Array.from(allBuilds)) {
    let webOnly =
      webBuilds.some((build) => build == buildName) &&
      !nodeBuilds.some((build) => build == buildName);
    let nodeOnly =
      !webBuilds.some((build) => build == buildName) &&
      nodeBuilds.some((build) => build == buildName);

    shouldUseDevserver = shouldUseDevserver && !nodeOnly;

    if (!nodeOnly) {
      let webpackConfig: Configuration = {
        name: `web-${buildName}`,
        target: "web",
        // Path to your entry point. From this file Webpack will begin its work
        entry: razzleContext.paths.appClientPath,

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: razzleContext.paths.appBuildPublic,
          publicPath: "",
          filename: "client.js",
        },

        // Default mode for Webpack is production.
        // Depending on mode Webpack will apply different things
        // on the final bundle. For now, we don't need production's JavaScript
        // minifying and other things, so let's set mode to development
        mode: "development",
      };
      let webpackOptions: Partial<Webpack5Options> = {
        isWeb: true,
        isNode: false,
        buildName: buildName,
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackOptions is a function.
        // If it is, call it on the context we created.
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
          webpackOptions = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            <Webpack5Options>webpackOptions
          );
        }
      }
      if (razzleConfig.modifyWebpackOptions) {
        // Check if razzle.modifyPaths is a function.
        // If it is, call it on the paths we created.
        webpackOptions = await razzleConfig.modifyWebpackOptions(
          razzleConfig,
          razzleContext,
          <Webpack5Options>webpackOptions
        );
      }

      webpackConfigs.push([webpackConfig, <Webpack5Options>webpackOptions]);
    }
    if (!webOnly) {
      let webpackConfig: Configuration = {
        name: `node-${buildName}`,
        target: "node",
        // Path to your entry point. From this file Webpack will begin its work
        entry: razzleContext.paths.appServerPath,

        // Path and filename of your result bundle.
        // Webpack will bundle all JavaScript into this file
        output: {
          path: razzleContext.paths.appBuild,
          publicPath: "",
          filename: "server.js",
        },

        // Default mode for Webpack is production.
        // Depending on mode Webpack will apply different things
        // on the final bundle. For now, we don't need production's JavaScript
        // minifying and other things, so let's set mode to development
        mode: "development",
      };

      const debugNodeExternals = true; /* razzleOptions.debug.nodeExternals; */
      // https://github.com/vercel/next.js/blob/canary/packages/next/build/webpack-config.ts#L211
      const nodeExternalsFunc = (context: string, request: string, callback) => {
        /*         if (webpackOptions.notNodeExternalResMatch &&
          webpackOptions.notNodeExternalResMatch(request, context)
        ) {
          if (debugNodeExternals) {
            console.log(`Not externalizing ${request} (using notNodeExternalResMatch)`);
          }
          return callback();
        }
   */
        const isLocal =
          request.startsWith(".") ||
          // Always check for unix-style path, as webpack sometimes
          // normalizes as posix.
          path.posix.isAbsolute(request) ||
          // When on Windows, we also want to check for Windows-specific
          // absolute paths.
          (process.platform === "win32" && path.win32.isAbsolute(request));

        // Relative requires don't need custom resolution, because they
        // are relative to requests we've already resolved here.
        // Absolute requires (require('/foo')) are extremely uncommon, but
        // also have no need for customization as they're already resolved.
        if (isLocal) {
          if (debugNodeExternals) {
            console.log(`Not externalizing ${request} (relative require)`);
          }
          return callback();
        }

        let res;
        try {
          res = resolveRequest(request, `${context}/`);
        } catch (err) {
          // If the request cannot be resolved, we need to tell webpack to
          // "bundle" it so that webpack shows an error (that it cannot be
          // resolved).
          if (debugNodeExternals) {
            console.log(`Not externalizing ${request} (cannot resolve)`);
          }
          return callback();
        }
        // Same as above, if the request cannot be resolved we need to have
        // webpack "bundle" it so it surfaces the not found error.
        if (!res) {
          if (debugNodeExternals) {
            console.log(`Not externalizing ${request} (cannot resolve)`);
          }
          return callback();
        }
        // This means we need to make sure its request resolves to the same
        // package that'll be available at runtime. If it's not identical,
        // we need to bundle the code (even if it _should_ be external).
        let baseRes: string|null = null;
        try {
          baseRes = <string>resolveRequest(request, `${razzleContext.paths.appPath}/`);
        } catch (err) {
          baseRes = null;
        }

        // Same as above: if the package, when required from the root,
        // would be different from what the real resolution would use, we
        // cannot externalize it.
        if (baseRes !== res) {
          if (debugNodeExternals) {
            console.log(
              `Not externalizing ${request} (real resolution differs)`
            );
          }
          return callback();
        }

        // This is the @babel/plugin-transform-runtime "helpers: true" option
        if (res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/)) {
          if (debugNodeExternals) {
            console.log(`Not externalizing @babel/plugin-transform-runtime`);
          }
          return callback();
        }

        // Anything else that is standard JavaScript within `node_modules`
        // can be externalized.
        if (res.match(/node_modules[/\\].*\.js$/)) {
          if (debugNodeExternals) {
            console.log(`Externalizing ${request} (node_modules)`);
          }
          return callback(undefined, `commonjs ${request}`);
        }

        if (debugNodeExternals) {
          console.log(`Not externalizing ${request} (default)`);
        }
        // Default behavior: bundle the code!
        return callback();
      };
      webpackConfig.externals = nodeExternalsFunc;
      let webpackOptions: Partial<Webpack5Options> = {
        isWeb: true,
        isNode: false,
        buildName: buildName,
      };
      // run plugin/config hooks
      for (const {
        plugin,
        options: childPluginOptions,
      } of razzleContext.plugins) {
        // Check if plugin.modifyWebpackOptions is a function.
        // If it is, call it on the context we created.
        if ((<Webpack5ChildPlugin>plugin).modifyWebpackOptions) {
          webpackOptions = await (<Required<Webpack5ChildPlugin>>(
            plugin
          )).modifyWebpackOptions(
            childPluginOptions,
            razzleConfig,
            razzleContext,
            <Webpack5Options>webpackOptions
          );
        }
      }
      if (razzleConfig.modifyWebpackOptions) {
        // Check if razzle.modifyPaths is a function.
        // If it is, call it on the paths we created.
        webpackOptions = await razzleConfig.modifyWebpackOptions(
          razzleConfig,
          razzleContext,
          <Webpack5Options>webpackOptions
        );
      }
      if (!nodeOnly) {
        webpackConfig.dependencies = [`web-${buildName}`];
      }

      webpackConfigs.push([webpackConfig, <Webpack5Options>webpackOptions]);
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
