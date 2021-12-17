import path from "path";

import { Plugin, PluginOptions } from "./types";
import { resolveExternal } from "./utils.js";

import type * as types from "./types";
export { types }

const plugin: Plugin = {
  name: "webpack5-externals",
  defaultOptions: {
    esmExternals: false,
  },
  modifyConfig: (
    pluginOptions,
    razzleConfig,
    razzleContext,
    webpackOptions,
    webpackConfig
  ) => {
    if (webpackOptions.isNode) {
      const looseEsmExternals = pluginOptions?.esmExternals === "loose";

      async function handleExternals(
        context: string,
        request: string,
        dependencyType: string,
        getResolve: (
          options: any
        ) => (
          resolveContext: string,
          resolveRequest: string
        ) => Promise<[string | null, boolean]>
      ) {
        // We need to externalize internal requests for files intended to
        // not be bundled.
        const isLocal: boolean =
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
        if (!isLocal) {
          /*         if (/^(?:next$|react(?:$|\/))/.test(request)) {
          return `commonjs ${request}`;
        }
 */
          /*        if (pluginOptions.notExternalsCallback && pluginOptions.notExternalsCallback(context, request)) {
          return;
        } */
        }

        // When in esm externals mode, and using import, we resolve with
        // ESM resolving options.
        const isEsmRequested = dependencyType === "esm";

        const isLocalCallback = (localRes: string) => {
          // Makes sure dist/shared and dist/server are not bundled
          // we need to process shared `router/router` and `dynamic`,
          // so that the DefinePlugin can inject process.env values
          /*  const isNextExternal =
          /next[/\\]dist[/\\](shared|server)[/\\](?!lib[/\\](router[/\\]router|dynamic))/.test(
            localRes
          );

        if (isNextExternal) {
          // Generate Next.js external import
          const externalRequest = path.posix.join(
            "next",
            "dist",
            path
              .relative(
                // Root of Next.js package:
                path.join(__dirname, ".."),
                localRes
              )
              // Windows path normalization
              .replace(/\\/g, "/")
          );
          return `commonjs ${externalRequest}`;
        } else { */
          // We don't want to retry local requests
          // with other preferEsm options
          // }
        };

        const resolveResult = await resolveExternal(
          razzleContext.paths.appPath,
          pluginOptions.esmExternals,
          context,
          request,
          isEsmRequested,
          getResolve,
          isLocal ? isLocalCallback : undefined
        );

        if ("localRes" in resolveResult) {
          return resolveResult.localRes;
        }
        const { res, isEsm } = resolveResult;

        // If the request cannot be resolved we need to have
        // webpack "bundle" it so it surfaces the not found error.
        if (!res) {
          return;
        }

        // ESM externals can only be imported (and not required).
        // Make an exception in loose mode.
        if (!isEsmRequested && isEsm && !looseEsmExternals) {
          throw new Error(
            `ESM packages (${request}) need to be imported. Use 'import' to reference the package instead. https://nextjs.org/docs/messages/import-esm-externals`
          );
        }

        const externalType = isEsm ? "module" : "commonjs";
        /* 
      if (
        res.match(/next[/\\]dist[/\\]shared[/\\](?!lib[/\\]router[/\\]router)/)
      ) {
        return `${externalType} ${request}`;
      }
 */
        // Default pages have to be transpiled
        if (
          // res.match(/[/\\]next[/\\]dist[/\\]/) ||
          // This is the @babel/plugin-transform-runtime "helpers: true" option
          res.match(/node_modules[/\\]@babel[/\\]runtime[/\\]/)
        ) {
          return;
        } /* 

      // Webpack itself has to be compiled because it doesn't always use module relative paths
      if (
        res.match(/node_modules[/\\]webpack/) ||
        res.match(/node_modules[/\\]css-loader/)
      ) {
        return;
      }
 */
        // Anything else that is standard JavaScript within `node_modules`
        // can be externalized.
        if (/node_modules[/\\].*\.[mc]?js$/.test(res)) {
          return `${externalType} ${request}`;
        }

        // Default behavior: bundle the code!
      }
      webpackConfig.externals =
        /*     targetWeb
    ? // make sure importing "next" is handled gracefully for client
      // bundles in case a user imported types and it wasn't removed
      // TODO: should we warn/error for this instead?
      [
        'next',
        ...(webServerRuntime
          ? [{ etag: '{}', chalk: '{}', 'react-dom': '{}' }]
          : []),
      ]
    : !isServerless
    ? */
        [
          ({
            context,
            request,
            dependencyType,
            getResolve,
          }: {
            context?: string;
            request?: string;
            dependencyType?: string;
            getResolve?: (
              options: any
            ) => (
              resolveContext: string,
              resolveRequest: string,
              callback: (
                err?: Error,
                result?: string,
                resolveData?: { descriptionFileData?: { type?: any } }
              ) => void
            ) => void;
          }) => {
//            console.log(request);

            return handleExternals(
              <string>context,
              <string>request,
              <string>dependencyType,
              (options) => {
                const resolveFunction = getResolve && getResolve(options);
                return (resolveContext: string, requestToResolve: string) =>
                  new Promise((resolve, reject) => {
                    resolveFunction &&
                      resolveFunction(
                        resolveContext,
                        requestToResolve,
                        (err, result, resolveData) => {
                          if (err) return reject(err);
                          if (!result) return resolve([null, false]);
                          const isEsm = /\.js$/i.test(result)
                            ? resolveData?.descriptionFileData?.type ===
                              "module"
                            : /\.mjs$/i.test(result);
                          resolve([result, isEsm]);
                        }
                      );
                  });
              }
            );
          },
        ];
      /* : [
        // When the 'serverless' target is used all node_modules will be compiled into the output bundles
        // So that the 'serverless' bundles have 0 runtime dependencies
        'next/dist/compiled/@ampproject/toolbox-optimizer', // except this one

        // Mark this as external if not enabled so it doesn't cause a
        // webpack error from being missing
        ...(config.experimental.optimizeCss ? [] : ['critters']),
      ] , */
    }
    return webpackConfig;
  },
};

export default function (options: PluginOptions): {
  plugin: Plugin;
  options: PluginOptions;
} {
  return {
    plugin: plugin,
    options: { ...(plugin.defaultOptions || {}), ...options },
  };
}
