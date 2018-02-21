const shell = require('shelljs');
const kill = require('../utils/psKill');

const errorRegex = /error/i;
shell.config.silent = true;

exports.run = ({ main, print, matches }) => {
  return new Promise((resolve, reject) => {
    const child = shell.exec(main, { async: true });
    child.stderr.on('data', killreject);
    child.stdout.on('data', data => containsError(data) && killreject(data));
    child.stdout.on('data', data => containsMatch(data) && killresolve());

    function containsMatch(data) {
      return data.includes(matches[0]);
    }
    function containsError(data) {
      return errorRegex.test(data.toString());
    }
    function killresolve() {
      shell.exec('sleep 5');
      const result = shell.exec(print).stdout.includes(matches[1]);
      kill(child.pid);
      resolve(result);
    }
    function killreject(stderr) {
      kill(child.pid);
      reject(stderr);
    }
  });
};
