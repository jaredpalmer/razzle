const consoleMethods = ['dir', 'log', 'info', 'warn', 'error'];

/**
 * Carbon board copy of ink-console's logcatcher, but hijacks the global console instead
 */

class LogCatcher {
  constructor() {
    this._log = [];
    this._handlers = new Set();
    this._reset = consoleMethods.map(method => {
      const originalFn = global.console[method];
      const customLog = (...args) => {
        this._log.push(
          method === 'dir'
            ? { type: 'dir', value: args[0] }
            : { type: method, values: args }
        );
        for (const value of this._handlers) {
          value();
        }
      };
      customLog.restore = originalFn.restore;
      global.console[method] = customLog;
      return () => {
        if (global.console[method] === customLog) {
          global.console[method] = originalFn;
        }
      };
    });
  }
  getLog() {
    return this._log.slice();
  }
  onUpdate(fn) {
    this._handlers.add(fn);
    return () => this._handlers.delete(fn);
  }
  dispose() {
    this._reset.forEach(fn => fn());
  }
}
module.exports = LogCatcher;
