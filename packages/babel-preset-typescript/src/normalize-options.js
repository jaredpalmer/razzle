import { OptionValidator } from "@babel/helper-validator-option";
const v = new OptionValidator("@babel/preset-typescript");

export default function normalizeOptions(options = {}) {
  let {
    allowNamespaces,
    jsxPragma,
    onlyRemoveTypeImports,
    allowReflectMetaData,
    allowClassDecorators,
    allowParameterDecorators,
    allowClassProperties,
    legacyDecorators,
    looseClassProperties
  } = options;

  if (process.env.BABEL_8_BREAKING) {
    const TopLevelOptions = {
      allExtensions: "allExtensions",
      allowNamespaces: "allowNamespaces",
      isTSX: "isTSX",
      jsxPragma: "jsxPragma",
      jsxPragmaFrag: "jsxPragmaFrag",
      onlyRemoveTypeImports: "onlyRemoveTypeImports",
      allowReflectMetaData: "allowReflectMetaData",
      allowClassDecorators: "allowClassDecorators",
      allowParameterDecorators: "allowParameterDecorators",
      allowClassProperties: "allowClassProperties",
      legacyDecorators: "legacyDecorators",
      looseClassProperties: "looseClassProperties"
    };
    v.validateTopLevelOptions(options, TopLevelOptions);

    allowNamespaces = v.validateBooleanOption(
      TopLevelOptions.allowNamespaces,
      options.allowNamespaces,
      true
    );
    jsxPragma = v.validateStringOption(
      TopLevelOptions.jsxPragma,
      options.jsxPragma,
      "React"
    );
    onlyRemoveTypeImports = v.validateBooleanOption(
      TopLevelOptions.onlyRemoveTypeImports,
      options.onlyRemoveTypeImports,
      true
    );
    allowReflectMetaData = v.validateBooleanOption(
      TopLevelOptions.allowReflectMetaData,
      options.allowReflectMetaData,
      true
    );
    allowClassDecorators = v.validateBooleanOption(
      TopLevelOptions.allowClassDecorators,
      options.allowClassDecorators,
      true
    );
    allowPropertyDecorators = v.validateBooleanOption(
      TopLevelOptions.allowPropertyDecorators,
      options.allowPropertyDecorators,
      true
    );
    allowClassProperties = v.validateBooleanOption(
      TopLevelOptions.allowClassProperties,
      options.allowClassProperties,
      true
    );
    legacyDecorators = v.validateBooleanOption(
      TopLevelOptions.legacyDecorators,
      options.legacyDecorators,
      true
    );
    looseClassProperties = v.validateBooleanOption(
      TopLevelOptions.looseClassProperties,
      options.looseClassProperties,
      true
    );
  }

  const jsxPragmaFrag = v.validateStringOption(
    "jsxPragmaFrag",
    options.jsxPragmaFrag,
    "React.Fragment"
  );

  const allExtensions = v.validateBooleanOption(
    "allExtensions",
    options.allExtensions,
    false
  );

  const isTSX = v.validateBooleanOption("isTSX", options.isTSX, false);

  if (isTSX) {
    v.invariant(allExtensions, "isTSX:true requires allExtensions:true");
  }

  return {
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
  };
}
