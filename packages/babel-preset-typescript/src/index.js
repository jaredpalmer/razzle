import { declare } from "@babel/helper-plugin-utils";

import transformTypeScript from "@babel/plugin-transform-typescript";

import transformReflectMetaData from "babel-plugin-transform-typescript-metadata";
import transformDecorators from "@babel/plugin-proposal-decorators";
import transformParameterDecorators from "babel-plugin-parameter-decorator";
import transformClassProperties from "@babel/plugin-proposal-class-properties";

import normalizeOptions from "./normalize-options.js";

export default declare((api, opts) => {
  api.assertVersion(7);
  console.log("using razzles typescript preset");
  const {
    allExtensions,
    allowNamespaces,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    allowReflectMetaData,
    allowDecorators,
    allowParameterDecorators,
    allowClassProperties,
    decoratorsBeforeExport,
    legacyDecorators,
    looseClassProperties
  } = normalizeOptions(api.caller, opts);

  const pluginOptions = process.env.BABEL_8_BREAKING
    ? isTSX => ({
        allowNamespaces,
        isTSX,
        jsxPragma,
        jsxPragmaFrag,
        onlyRemoveTypeImports
      })
    : isTSX => ({
        allowDeclareFields: opts.allowDeclareFields,
        allowNamespaces,
        isTSX,
        jsxPragma,
        jsxPragmaFrag,
        onlyRemoveTypeImports
      });

  const decoratorOptions = {
    legacy: legacyDecorators // on by default
  };
  const classPropertiesOptions = {
    loose: looseClassProperties // on by default
  };
  console.log({
    allExtensions,
    allowNamespaces,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports,
    allowReflectMetaData,
    allowDecorators,
    allowParameterDecorators,
    allowClassProperties,
    decoratorsBeforeExport,
    legacyDecorators,
    looseClassProperties
  });

  console.log(decoratorOptions);

  console.log(classPropertiesOptions);

  return {
    overrides: allExtensions
      ? [
          {
            plugins: [
              [transformTypeScript, pluginOptions(true)],
              allowReflectMetaData && transformReflectMetaData, // on by default
              allowDecorators && [transformDecorators, decoratorOptions], // on by default
              allowClassProperties && [ // on by default
                transformClassProperties, classPropertiesOptions
              ],
              allowParameterDecorators && transformParameterDecorators // on by default
            ].filter(Boolean)
          }
        ]
      : [
          {
            // Only set 'test' if explicitly requested, since it requires that
            // Babel is being called`
            test: /\.ts$/,
            plugins: [
              [transformTypeScript, pluginOptions(true)],
              allowReflectMetaData && transformReflectMetaData,
              allowDecorators && [transformDecorators, decoratorOptions],
              allowClassProperties && [
                transformClassProperties, classPropertiesOptions
              ],
              allowParameterDecorators && transformParameterDecorators // on by default
            ].filter(Boolean)
          },
          {
            // Only set 'test' if explicitly requested, since it requires that
            // Babel is being called`
            test: /\.tsx$/,
            plugins: [
              [transformTypeScript, pluginOptions(true)],
              allowReflectMetaData && transformReflectMetaData,
              allowDecorators && [transformDecorators, decoratorOptions],
              allowClassProperties && [
                transformClassProperties, classPropertiesOptions
              ],
              allowParameterDecorators && transformParameterDecorators // on by default
            ].filter(Boolean)
          }
        ]
  };
});
