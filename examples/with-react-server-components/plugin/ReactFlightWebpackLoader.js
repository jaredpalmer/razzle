"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

// eslint-disable-next-line
function _default(source) {
  let newSrc = "const MODULE_REFERENCE = Symbol.for('react.module.reference');\n"; // TODO - extract names (export names) using acorn, check ReactFlightWebpackNodeLoader

  const names = ['default'];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    if (name === 'default') {
      newSrc += 'export default ';
    } else {
      newSrc += 'export const ' + name + ' = ';
    }

    newSrc += '{ $$typeof: MODULE_REFERENCE, filepath: ';
    newSrc += `'file://${this.resourcePath}'`;
    newSrc += ', name: ';
    newSrc += JSON.stringify(name);
    newSrc += '};\n';
  }

  console.log({
    newSrc
  });
  return newSrc;
}