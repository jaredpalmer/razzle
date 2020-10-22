"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _monitor = _interopRequireDefault(require("./monitor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This loader just returns the monitor source
// this way it can be embedded without processing or messing with external handling
const monitorSrc = `(${_monitor.default.toString()})()`;

const loader = function () {
  return monitorSrc;
};

var _default = loader;
exports.default = _default;