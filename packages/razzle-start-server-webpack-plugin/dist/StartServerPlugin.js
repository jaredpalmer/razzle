"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _child_process = _interopRequireDefault(require("child_process"));

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpackMajorVersion = typeof _webpack.default.version !== 'undefined' ? parseInt(_webpack.default.version[0]) : 3;

class StartServerPlugin {
  constructor(options) {
    if (options == null) {
      options = {};
    }

    if (typeof options === 'string') {
      options = {
        entryName: options
      };
    }

    this.options = Object.assign({
      verbose: true,
      // print logs
      entryName: 'main',
      // What to run
      once: false,
      // Run once and exit when worker exits
      nodeArgs: [],
      // Node arguments for worker
      scriptArgs: [],
      // Script arguments for worker
      signal: false,
      // Send a signal instead of a message
      // Only listen on keyboard in development, so the server doesn't hang forever
      restartable: process.env.NODE_ENV === 'development',
      inject: true,
      // inject monitor to script
      killOnExit: true,
      // issue SIGKILL on child process exit
      killOnError: true,
      // issue SIGKILL on child process error
      killTimeout: 1000 // timeout before SIGKILL in milliseconds

    }, options);

    if (this.options.args) {
      throw new Error('options.args is now options.scriptArgs');
    }

    if (!Array.isArray(this.options.scriptArgs)) {
      throw new Error('options.args has to be an array of strings');
    }

    if (this.options.signal === true) {
      this.options.signal = 'SIGUSR2';
      this.options.inject = false;
    }

    this.afterEmit = this.afterEmit.bind(this);
    this.apply = this.apply.bind(this);
    this._handleChildError = this._handleChildError.bind(this);
    this._handleChildExit = this._handleChildExit.bind(this);
    this._handleChildQuit = this._handleChildQuit.bind(this);
    this._handleChildMessage = this._handleChildMessage.bind(this);
    this._handleWebpackExit = this._handleWebpackExit.bind(this);
    this._handleProcessKill = this._handleProcessKill.bind(this);
    this.worker = null;

    if (this.options.restartable && !options.once) {
      this._enableRestarting();
    }
  }

  _info(msg, ...args) {
    if (this.options.verbose) console.log(`sswp> ${msg}`, ...args);
  }

  _error(msg, ...args) {
    console.error(`sswp> !!! ${msg}`, ...args);
  }

  _worker_error(msg, ...args) {
    process.stderr.write(msg);
  }

  _worker_info(msg, ...args) {
    process.stdout.write(msg);
  }

  _enableRestarting() {
    this._info('Type `rs<Enter>` to restart the worker');

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', data => {
      if (data.trim() === 'rs') {
        if (this.worker) {
          this._info('Killing worker...');

          process.kill(this.worker.pid);
        } else {
          this._runWorker();
        }
      }
    });
  }

  _getScript(compilation) {
    const {
      entryName
    } = this.options;
    const entrypoints = compilation.entrypoints;
    const entry = entrypoints.get ? entrypoints.get(entryName) : entrypoints[entryName];

    if (!entry) {
      this._info('compilation: %O', compilation);

      throw new Error(`Requested entry "${entryName}" does not exist, try one of: ${(entrypoints.keys ? entrypoints.keys() : Object.keys(entrypoints)).join(' ')}`);
    }

    const runtimeChunk = _webpack.default.EntryPlugin && (entry.runtimeChunk || entry._entrypointChunk);
    const runtimeChunkFiles = runtimeChunk && runtimeChunk.files && runtimeChunk.files.values();
    const entryScript = runtimeChunkFiles && runtimeChunkFiles.next().value || ((entry.chunks[0] || {}).files || [])[0];

    if (!entryScript) {
      this._error("Entry chunk not outputted: %O", entry);

      return;
    }

    const {
      path
    } = compilation.outputOptions;
    return _path.default.resolve(path, entryScript);
  }

  _getExecArgv() {
    const {
      options
    } = this;
    const execArgv = (options.nodeArgs || []).concat(process.execArgv);
    return execArgv;
  }

  _handleChildQuit() {
    this.worker = null;
  }

  _handleChildExit(code, signal) {
    this._error(`Script exited with ${signal ? `signal ${signal}` : `code ${code}`}`);

    this.worker = null;

    if (code === 143 || signal === 'SIGTERM') {
      if (!this.workerLoaded) {
        this._error('Script did not load, or HMR failed; not restarting');

        return;
      }

      if (this.options.once) {
        this._info('Only running script once, as requested');

        return;
      }

      this.workerLoaded = false;

      this._runWorker();

      return;
    }

    if (this.options.killOnExit) {
      this._handleProcessKill();
    }
  }

  _handleWebpackExit() {
    if (this.worker) {
      process.kill(this.worker.pid, 'SIGINT');
    }
  }

  _handleChildError(err) {
    this._error('Script errored');

    this.worker = null;

    if (this.options.killOnError) {
      this._handleProcessKill();
    }
  }

  _handleProcessKill() {
    const pKill = () => process.kill(process.pid, 'SIGKILL');

    if (!isNaN(this.options.killTimeout)) {
      setTimeout(pKill, this.options.killTimeout);
    } else {
      pKill();
    }
  }

  _handleChildMessage(message) {
    if (message === 'SSWP_LOADED') {
      this.workerLoaded = true;

      this._info('Script loaded');

      if (process.env.NODE_ENV === 'test' && this.options.once) {
        process.kill(this.worker.pid);
      }
    } else if (message === 'SSWP_HMR_FAIL') {
      this.workerLoaded = false;
    }
  }

  _runWorker(callback) {
    if (this.worker) return;
    const {
      scriptFile,
      options: {
        scriptArgs
      }
    } = this;

    const execArgv = this._getExecArgv();

    const extScriptArgs = ['--color', '--ansi', ...scriptArgs];

    if (this.options.verbose) {
      const cmdline = [...execArgv, scriptFile, '--', ...extScriptArgs].join(' ');

      this._info(`running \`node ${cmdline}\``);
    }

    const worker = _child_process.default.fork(scriptFile, extScriptArgs, {
      execArgv,
      silent: true,
      env: Object.assign(process.env, {
        FORCE_COLOR: 3
      })
    });

    worker.on('exit', this._handleChildExit);
    worker.on('quit', this._handleChildQuit);
    worker.on('error', this._handleChildError);
    worker.on('message', this._handleChildMessage);
    worker.stdout.on('data', this._worker_info);
    worker.stderr.on('data', this._worker_error);
    process.on('SIGINT', this._handleWebpackExit);
    this.worker = worker;
    if (callback) callback();
  }

  _hmrWorker(compilation, callback) {
    const {
      worker,
      options: {
        signal
      }
    } = this;

    if (signal) {
      process.kill(worker.pid, signal);
    } else if (worker.send) {
      worker.send('SSWP_HMR');
    } else {
      this._error('hot reloaded but no way to tell the worker');
    }

    callback();
  }

  afterEmit(compilation, callback) {
    this.scriptFile = this._getScript(compilation);

    if (this.worker) {
      return this._hmrWorker(compilation, callback);
    }

    if (!this.scriptFile) return;

    this._runWorker(callback);
  }

  _getMonitor() {
    const loaderPath = require.resolve('./monitor-loader');

    return `!!${loaderPath}!${loaderPath}`;
  }

  _amendEntry(entry) {
    if (typeof entry === 'function') return (...args) => Promise.resolve(entry(...args)).then(this._amendEntry.bind(this));

    const monitor = this._getMonitor();

    if (typeof entry === 'string') return [entry, monitor];
    if (Array.isArray(entry)) return [...entry, monitor];

    if (typeof entry === 'object') {
      return Object.assign({}, entry, {
        [this.options.entryName]: this._amendEntry(entry[this.options.entryName])
      });
    }

    throw new Error('Cannot parse webpack `entry` option: %O', entry);
  }

  apply(compiler) {
    const inject = this.options.inject; // webpack v4+

    if (webpackMajorVersion >= 4) {
      const plugin = {
        name: 'StartServerPlugin'
      }; // webpack v5+

      if (webpackMajorVersion >= 5) {
        if (inject) {
          compiler.hooks.make.tap(plugin, compilation => {
            compilation.addEntry(compilation.compiler.context, _webpack.default.EntryPlugin.createDependency(this._getMonitor(), {
              name: this.options.entryName
            }), this.options.entryName, () => {});
          });
        }
      } else {
        if (inject) {
          compiler.options.entry = this._amendEntry(compiler.options.entry);
        }
      }

      compiler.hooks.afterEmit.tapAsync(plugin, this.afterEmit);
    } else {
      // webpack v3-
      if (inject) {
        compiler.options.entry = this._amendEntry(compiler.options.entry);
      }

      compiler.plugin('after-emit', this.afterEmit);
    }
  }

}

exports.default = StartServerPlugin;
module.exports = StartServerPlugin;