/*
 * Partially adapted from @babel/core (MIT license).
 */

import loadBlockHoistPlugin from "@babel/core/lib/transformation/block-hoist-plugin.js";
import normalizeFile from "@babel/core/lib/transformation/normalize-file.js";
import normalizeOpts from "@babel/core/lib/transformation/normalize-opts.js";
import PluginPass from "@babel/core/lib/transformation/plugin-pass.js";
import generate from "@babel/generator";
import traverse from "@babel/traverse";

import getConfig from "./get-config.js";
import { RazzleWebpack5LoaderContext, Source, SourceMap } from "./types";
import { consumeIterator } from "./util.js";

function getTraversalParams(file: any, pluginPairs: any[]) {
  const passPairs: Array<[any, any]> = [];
  const passes: Array<any> = [];
  const visitors: Array<any> = [];

  for (const plugin of pluginPairs.concat(loadBlockHoistPlugin())) {
    const pass = new PluginPass(file, plugin.key, plugin.options);
    passPairs.push([plugin, pass]);
    passes.push(pass);
    visitors.push(plugin.visitor);
  }

  return { passPairs, passes, visitors };
}

function invokePluginPre(file: any, passPairs: any[]) {
  for (const [{ pre }, pass] of passPairs) {
    if (pre) {
      pre.call(pass, file);
    }
  }
}

function invokePluginPost(file: any, passPairs: any[]) {
  for (const [{ post }, pass] of passPairs) {
    if (post) {
      post.call(pass, file);
    }
  }
}

function transformAstPass(file: any, pluginPairs: any[]) {
  const { passPairs, passes, visitors } = getTraversalParams(file, pluginPairs);

  invokePluginPre(file, passPairs);

  const visitor = traverse.visitors.merge(
    visitors,
    passes,
    // @ts-ignore - the exported types are incorrect here
    file.opts.wrapPluginVisitorMethod
  );

  traverse(file.ast, visitor, file.scope);

  invokePluginPost(file, passPairs);
}

function transformAst(file: any, babelConfig: any) {
  for (const pluginPairs of babelConfig.passes) {
    transformAstPass(file, pluginPairs);
  }
}

export default async function transform(
  this: RazzleWebpack5LoaderContext,
  source: Source,
  inputSourceMap: SourceMap,
  loaderOptions: any,
  filename: string,
  target: string | [string, string]
) {  

  const babelConfig = await getConfig.call(this, {
    source,
    loaderOptions,
    inputSourceMap,
    target,
    filename,
  });
  
  const file = consumeIterator(
    normalizeFile(babelConfig.passes, normalizeOpts(babelConfig), source)
  );

  transformAst(file, babelConfig);

  const { code, map } = generate(file.ast, file.opts.generatorOpts, file.code);

  return { code, map };
}
