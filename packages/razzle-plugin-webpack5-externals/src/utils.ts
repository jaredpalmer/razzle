

export const NODE_RESOLVE_OPTIONS = {
    dependencyType: 'commonjs',
    modules: ['node_modules'],
    fallback: false,
    exportsFields: ['exports'],
    importsFields: ['imports'],
    conditionNames: ['node', 'require'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.json', '.node'],
    enforceExtensions: false,
    symlinks: true,
    mainFields: ['main'],
    mainFiles: ['index'],
    roots: [],
    fullySpecified: false,
    preferRelative: false,
    preferAbsolute: false,
    restrictions: [],
  }
  
  export const NODE_BASE_RESOLVE_OPTIONS = {
    ...NODE_RESOLVE_OPTIONS,
    alias: false,
  }
  
  export const NODE_ESM_RESOLVE_OPTIONS = {
    ...NODE_RESOLVE_OPTIONS,
    alias: false,
    dependencyType: 'esm',
    conditionNames: ['node', 'import'],
    fullySpecified: true,
  }
  
  export const NODE_BASE_ESM_RESOLVE_OPTIONS = {
    ...NODE_ESM_RESOLVE_OPTIONS,
    alias: false,
  }
  export async function resolveExternal(
    appDir: string,
    esmExternalsConfig: boolean | 'loose',
    context: string,
    request: string,
    isEsmRequested: boolean,
    getResolve: (
      options: any
    ) => (
      resolveContext: string,
      resolveRequest: string
    ) => Promise<[string | null, boolean]>,
    isLocalCallback?: (res: string) => any,
    baseResolveCheck = true,
    esmResolveOptions: any = NODE_ESM_RESOLVE_OPTIONS,
    nodeResolveOptions: any = NODE_RESOLVE_OPTIONS,
    baseEsmResolveOptions: any = NODE_BASE_ESM_RESOLVE_OPTIONS,
    baseResolveOptions: any = NODE_BASE_RESOLVE_OPTIONS
  ) {
    const esmExternals = !!esmExternalsConfig
    const looseEsmExternals = esmExternalsConfig === 'loose'
  
    let res: string | null = null
    let isEsm: boolean = false
  
    let preferEsmOptions =
      esmExternals && isEsmRequested ? [true, false] : [false]
    for (const preferEsm of preferEsmOptions) {
      const resolve = getResolve(
        preferEsm ? esmResolveOptions : nodeResolveOptions
      )
  
      // Resolve the import with the webpack provided context, this
      // ensures we're resolving the correct version when multiple
      // exist.
      try {
        ;[res, isEsm] = await resolve(context, request)
      } catch (err) {
        res = null
      }
  
      if (!res) {
        continue
      }
  
      // ESM externals can only be imported (and not required).
      // Make an exception in loose mode.
      if (!isEsmRequested && isEsm && !looseEsmExternals) {
        continue
      }
  
      if (isLocalCallback) {
        return { localRes: isLocalCallback(res) }
      }
  
      // Bundled Node.js code is relocated without its node_modules tree.
      // This means we need to make sure its request resolves to the same
      // package that'll be available at runtime. If it's not identical,
      // we need to bundle the code (even if it _should_ be external).
      if (baseResolveCheck) {
        let baseRes: string | null
        let baseIsEsm: boolean
        try {
          const baseResolve = getResolve(
            isEsm ? baseEsmResolveOptions : baseResolveOptions
          )
          ;[baseRes, baseIsEsm] = await baseResolve(appDir, request)
        } catch (err) {
          baseRes = null
          baseIsEsm = false
        }
  
        // Same as above: if the package, when required from the root,
        // would be different from what the real resolution would use, we
        // cannot externalize it.
        // if request is pointing to a symlink it could point to the the same file,
        // the resolver will resolve symlinks so this is handled
        if (baseRes !== res || isEsm !== baseIsEsm) {
          res = null
          continue
        }
      }
      break
    }
    return { res, isEsm }
  }
  