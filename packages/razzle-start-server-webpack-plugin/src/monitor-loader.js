// This loader just returns the monitor source
// this way it can be embedded without processing or messing with external handling
import monitorFn from './monitor';

const monitorSrc = `(${monitorFn.toString()})()`;

const loader = function () {
  return monitorSrc;
};

export default loader;
