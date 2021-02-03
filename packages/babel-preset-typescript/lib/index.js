"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _pluginTransformTypescript = _interopRequireDefault(require("@babel/plugin-transform-typescript"));

var _babelPluginTransformTypescriptMetadata = _interopRequireDefault(require("babel-plugin-transform-typescript-metadata"));

var _pluginProposalDecorators = _interopRequireDefault(require("@babel/plugin-proposal-decorators"));

var _babelPluginParameterDecorator = _interopRequireDefault(require("babel-plugin-parameter-decorator"));

var _pluginProposalClassProperties = _interopRequireDefault(require("@babel/plugin-proposal-class-properties"));

var _normalizeOptions = _interopRequireDefault(require("./normalize-options.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)((api, opts) => {
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
  } = (0, _normalizeOptions.default)(opts);
  const pluginOptions = process.env.BABEL_8_BREAKING ? isTSX => ({
    allowNamespaces,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports
  }) : isTSX => ({
    allowDeclareFields: opts.allowDeclareFields,
    allowNamespaces,
    isTSX,
    jsxPragma,
    jsxPragmaFrag,
    onlyRemoveTypeImports
  });
  const decoratorOptions = {
    legacy: legacyDecorators,
    decoratorsBeforeExport: decoratorsBeforeExport
  };
  console.log(decoratorOptions);
  return {
    overrides: allExtensions ? [{
      plugins: [[_pluginTransformTypescript.default, pluginOptions(true)], allowReflectMetaData && _babelPluginTransformTypescriptMetadata.default, allowDecorators && [_pluginProposalDecorators.default, decoratorOptions], allowClassProperties && [_pluginProposalClassProperties.default, looseClassProperties ? {
        loose: true
      } : {}], allowParameterDecorators && _babelPluginParameterDecorator.default].filter(Boolean)
    }] : [{
      // Only set 'test' if explicitly requested, since it requires that
      // Babel is being called`
      test: /\.ts$/,
      plugins: [[_pluginTransformTypescript.default, pluginOptions(true)], allowReflectMetaData && _babelPluginTransformTypescriptMetadata.default, allowDecorators && [_pluginProposalDecorators.default, decoratorOptions], allowParameterDecorators && _babelPluginParameterDecorator.default, allowClassProperties && [_pluginProposalClassProperties.default, looseClassProperties ? {
        loose: true
      } : {}], allowParameterDecorators && _babelPluginParameterDecorator.default].filter(Boolean)
    }, {
      // Only set 'test' if explicitly requested, since it requires that
      // Babel is being called`
      test: /\.tsx$/,
      plugins: [[_pluginTransformTypescript.default, pluginOptions(true)], allowReflectMetaData && _babelPluginTransformTypescriptMetadata.default, allowDecorators && [_pluginProposalDecorators.default, decoratorOptions], allowClassProperties && [_pluginProposalClassProperties.default, looseClassProperties ? {
        loose: true
      } : {}], allowParameterDecorators && _babelPluginParameterDecorator.default].filter(Boolean)
    }]
  };
});

exports.default = _default;