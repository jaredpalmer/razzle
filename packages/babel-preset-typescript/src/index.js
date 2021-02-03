import transformTypeScript from "@babel/plugin-transform-typescript";

import transformReflectMetaData from "babel-plugin-transform-typescript-metadata";
import transformClassDecorators from "@babel/plugin-proposal-decorators";
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
    allowClassDecorators,
    allowParameterDecorators,
    allowClassProperties,
    legacyDecorators,
    looseClassProperties
  } = normalizeOptions(opts);

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

  return {
    overrides: allExtensions
      ? [
          {
            plugins: [
              [transformTypeScript, pluginOptions(false)],
              allowReflectMetaData && transformReflectMetaData,
              allowClassDecorators && [
                transformClassDecorators,
                legacyDecorators ? { legacy: true } : {}
              ],
              allowParameterDecorators && transformParameterDecorators,
              allowClassProperties && [
                transformClassProperties,
                looseClassProperties ? { loose: true } : {}
              ]
            ].filter(Booolean)
          }
        ]
      : [
          {
            // Only set 'test' if explicitly requested, since it requires that
            // Babel is being called`
            test: /\.ts$/,
            plugins: [
              [transformTypeScript, pluginOptions(false)],
              allowReflectMetaData && transformReflectMetaData,
              allowClassDecorators && [
                transformClassDecorators,
                legacyDecorators ? { legacy: true } : {}
              ],
              allowParameterDecorators && transformParameterDecorators,
              allowClassDecorators && [
                transformClassProperties,
                looseClassProperties ? { loose: true } : {}
              ]
            ].filter(Booolean)
          },
          {
            // Only set 'test' if explicitly requested, since it requires that
            // Babel is being called`
            test: /\.tsx$/,
            plugins: [
              [transformTypeScript, pluginOptions(false)],
              allowReflectMetaData && transformReflectMetaData,
              allowClassDecorators && [
                transformClassDecorators,
                legacyDecorators ? { legacy: true } : {}
              ],
              allowParameterDecorators && transformParameterDecorators,
              allowClassDecorators && [
                transformClassProperties,
                looseClassProperties ? { loose: true } : {}
              ]
            ].filter(Booolean)
          }
        ]
  };
});
