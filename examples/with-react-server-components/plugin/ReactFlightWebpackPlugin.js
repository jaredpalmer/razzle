"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = require("path");

var _url = require("url");

var _neoAsync = _interopRequireDefault(require("neo-async"));

var _ModuleDependency = _interopRequireDefault(require("webpack/lib/dependencies/ModuleDependency"));

var _NullDependency = _interopRequireDefault(require("webpack/lib/dependencies/NullDependency"));

var _AsyncDependenciesBlock = _interopRequireDefault(require("webpack/lib/AsyncDependenciesBlock"));

var _Template = _interopRequireDefault(require("webpack/lib/Template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class ClientReferenceDependency extends _ModuleDependency.default {
  constructor(request) {
    super(request);
  }

  get type() {
    return 'client-reference';
  }

} // This is the module that will be used to anchor all client references to.
// I.e. it will have all the client files as async deps from this point on.
// We use the Flight client implementation because you can't get to these
// without the client runtime so it's the first time in the loading sequence
// you might want them.
// TODO - fix this;
// const clientFileName = require.resolve('../');


const clientFileName = (0, _path.join)(__dirname, '../node_modules/react-server-dom-webpack/index.js');
const PLUGIN_NAME = 'React Server Plugin';

class ReactFlightWebpackPlugin {
  constructor(options) {
    _defineProperty(this, "clientReferences", void 0);

    _defineProperty(this, "chunkName", void 0);

    _defineProperty(this, "manifestFilename", void 0);

    if (!options || typeof options.isServer !== 'boolean') {
      throw new Error(PLUGIN_NAME + ': You must specify the isServer option as a boolean.');
    }

    if (options.isServer) {
      throw new Error('TODO: Implement the server compiler.');
    }

    if (!options.clientReferences) {
      this.clientReferences = [{
        directory: '.',
        recursive: true,
        include: /\.client\.(js|ts|jsx|tsx)$/
      }];
    } else if (typeof options.clientReferences === 'string' || !Array.isArray(options.clientReferences)) {
      this.clientReferences = options.clientReferences;
    } else {
      this.clientReferences = options.clientReferences;
    }

    if (typeof options.chunkName === 'string') {
      this.chunkName = options.chunkName;

      if (!/\[(index|request)\]/.test(this.chunkName)) {
        this.chunkName += '[index]';
      }
    } else {
      this.chunkName = 'client[index]';
    }

    this.manifestFilename = options.manifestFilename || 'react-client-manifest.json';
  }

  apply(compiler) {
    let resolvedClientReferences;

    const run = (params, callback) => {
      // First we need to find all client files on the file system. We do this early so
      // that we have them synchronously available later when we need them. This might
      // not be needed anymore since we no longer need to compile the module itself in
      // a special way. So it's probably better to do this lazily and in parallel with
      // other compilation.
      const contextResolver = compiler.resolverFactory.get('context', {});
      this.resolveAllClientFiles(compiler.context, contextResolver, compiler.inputFileSystem, compiler.createContextModuleFactory(), (err, resolvedClientRefs) => {
        if (err) {
          callback(err);
          return;
        }

        resolvedClientReferences = resolvedClientRefs;
        callback();
      });
    };

    compiler.hooks.run.tapAsync(PLUGIN_NAME, run);
    compiler.hooks.watchRun.tapAsync(PLUGIN_NAME, run);
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation, {
      normalModuleFactory
    }) => {
      compilation.dependencyFactories.set(ClientReferenceDependency, normalModuleFactory);
      compilation.dependencyTemplates.set(ClientReferenceDependency, new _NullDependency.default.Template());
      compilation.hooks.buildModule.tap(PLUGIN_NAME, module => {
        // We need to add all client references as dependency of something in the graph so
        // Webpack knows which entries need to know about the relevant chunks and include the
        // map in their runtime. The things that actually resolves the dependency is the Flight
        // client runtime. So we add them as a dependency of the Flight client runtime.
        // Anything that imports the runtime will be made aware of these chunks.
        // TODO: Warn if we don't find this file anywhere in the compilation.
        if (module.resource !== clientFileName) {
          return;
        }

        if (resolvedClientReferences) {
          for (let i = 0; i < resolvedClientReferences.length; i++) {
            const dep = resolvedClientReferences[i];
            const chunkName = this.chunkName.replace(/\[index\]/g, '' + i).replace(/\[request\]/g, _Template.default.toPath(dep.userRequest));
            const block = new _AsyncDependenciesBlock.default({
              name: chunkName
            }, module, null, dep.require);
            block.addDependency(dep);
            module.addBlock(block);
          }
        }
      });
    });
    compiler.hooks.emit.tap(PLUGIN_NAME, compilation => {
      const json = {};
      compilation.chunkGroups.forEach(chunkGroup => {
        const chunkIds = chunkGroup.chunks.map(c => c.id);

        function recordModule(id, mod) {
          // TODO: Hook into deps instead of the target module.
          // That way we know by the type of dep whether to include.
          // It also resolves conflicts when the same module is in multiple chunks.
          if (!/\.client\.(js|jsx|ts|tsx)$/.test(mod.resource)) {
            return;
          }

          const moduleExports = {};
          ['', '*'].concat(mod.buildMeta.providedExports).forEach(name => {
            moduleExports[name] = {
              id: id,
              chunks: chunkIds,
              name: name
            };
          });
          const href = (0, _url.pathToFileURL)(mod.resource).href;

          if (href !== undefined) {
            json[href] = moduleExports;
          }
        }

        chunkGroup.chunks.forEach(chunk => {
          chunk.getModules().forEach(mod => {
            recordModule(mod.id, mod); // If this is a concatenation, register each child to the parent ID.

            if (mod.modules) {
              mod.modules.forEach(concatenatedMod => {
                recordModule(mod.id, concatenatedMod);
              });
            }
          });
        });
      });
      const output = JSON.stringify(json, null, 2);
      compilation.assets[this.manifestFilename] = {
        source() {
          return output;
        },

        size() {
          return output.length;
        }

      };
    });
  } // This attempts to replicate the dynamic file path resolution used for other wildcard
  // resolution in Webpack is using.


  resolveAllClientFiles(context, contextResolver, fs, contextModuleFactory, callback) {
    _neoAsync.default.map(this.clientReferences, (clientReferencePath, cb) => {
      if (typeof clientReferencePath === 'string') {
        cb(null, [new ClientReferenceDependency(clientReferencePath)]);
        return;
      }

      const clientReferenceSearch = clientReferencePath;
      contextResolver.resolve({}, context, clientReferencePath.directory, {}, (err, resolvedDirectory) => {
        if (err) return cb(err);
        const options = {
          resource: resolvedDirectory,
          resourceQuery: '',
          recursive: clientReferenceSearch.recursive === undefined ? true : clientReferenceSearch.recursive,
          regExp: clientReferenceSearch.include,
          include: undefined,
          exclude: clientReferenceSearch.exclude
        };
        contextModuleFactory.resolveDependencies(fs, options, (err2, deps) => {
          if (err2) return cb(err2);
          const clientRefDeps = deps.map(dep => {
            const request = (0, _path.join)(resolvedDirectory, dep.request);
            const clientRefDep = new ClientReferenceDependency(request);
            clientRefDep.userRequest = dep.userRequest;
            return clientRefDep;
          });
          cb(null, clientRefDeps);
        });
      });
    }, (err, result) => {
      if (err) return callback(err);
      const flat = [];

      for (let i = 0; i < result.length; i++) {
        flat.push.apply(flat, result[i]);
      }

      callback(null, flat);
    });
  }

}

exports.default = ReactFlightWebpackPlugin;