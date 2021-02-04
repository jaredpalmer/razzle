import { OptionValidator } from "@babel/helper-validator-option";
const v = new OptionValidator("@babel/preset-typescript");

export default function normalizeOptions(caller, options = {}) {
  let {
    allowNamespaces,
    jsxPragma,
    onlyRemoveTypeImports,
    allowReflectMetaData,
    allowDecorators,
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
      onlyRemoveTypeImports: "onlyRemoveTypeImports"
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
      "onlyRemoveTypeImports",
      options.onlyRemoveTypeImports,
      true
    );
  }
  allowReflectMetaData = v.validateBooleanOption(
    "allowReflectMetaData",
    options.allowReflectMetaData,
    true
  );
  allowDecorators = v.validateBooleanOption(
    "allowDecorators",
    options.allowDecorators,
    true
  );
  allowParameterDecorators = v.validateBooleanOption(
    "allowParameterDecorators",
    options.allowParameterDecorators,
    true
  );
  allowClassProperties = v.validateBooleanOption(
    "allowClassProperties",
    options.allowClassProperties,
    true
  );
  legacyDecorators = v.validateBooleanOption(
    "legacyDecorators",
    options.legacyDecorators,
    true
  );
  looseClassProperties = v.validateBooleanOption(
    "looseClassProperties",
    options.looseClassProperties,
    true
  );

  const jsxPragmaFrag = v.validateStringOption(
    "jsxPragmaFrag",
    options.jsxPragmaFrag,
    "React.Fragment"
  );

  const allExtensions = v.validateBooleanOption(
    "allExtensions",
    options.allExtensions,
    !/^@babel\//.test((caller||{}).name||'')
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
    allowDecorators,
    allowParameterDecorators,
    allowClassProperties,
    legacyDecorators,
    looseClassProperties
  };
}
