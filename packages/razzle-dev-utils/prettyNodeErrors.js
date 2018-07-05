const {
  formatExecError,
  separateMessageFromStack,
} = require('jest-message-util');

function pretty(error) {
  return `\n${formatExecError(
    error,
    { rootDir: process.cwd() },
    {},
    undefined,
    true
  )}`;
}

function usePrettyErrors(transform) {
  const { prepareStackTrace } = Error;

  Error.prepareStackTrace = (error, trace) => {
    const prepared = prepareStackTrace
      ? separateMessageFromStack(prepareStackTrace(error, trace))
      : error;
    const transformed = transform ? transform(prepared) : prepared;

    return pretty(transformed);
  };
}

// Currently needed to fix sourcemap path
const stackTransform = ({ stack = '', ...rest }) => ({
  stack: stack.replace('/build/webpack:', ''),
  ...rest,
});

usePrettyErrors(stackTransform);
