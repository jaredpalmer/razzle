import Plugin from '..';

class SilentPlugin extends Plugin {
  _worker_error(msg, ...args) {}

  _worker_info(msg, ...args) {}
}

module.exports = SilentPlugin;
