const chalk = require('chalk');

module.exports = function(opts) {
  const t = opts.types;
  let onWarning = null;
  opts.caller(caller => {
    onWarning = caller.onWarning;
    return ''; // Intentionally empty to not invalidate cache
  });

  if (typeof onWarning !== 'function') {
    return { visitor: {} };
  }

  const warn = onWarning;
  return {
    visitor: {
      ExportDefaultDeclaration: function(path) {
        const def = path.node.declaration;

        if (
          !(
            def.type === 'ArrowFunctionExpression' ||
            def.type === 'FunctionDeclaration'
          )
        ) {
          return;
        }

        switch (def.type) {
          case 'ArrowFunctionExpression': {
            warn(
              [
                chalk.yellow.bold(
                  'Anonymous arrow functions cause Fast Refresh to not preserve local component state.'
                ),
                'Please add a name to your function, for example:',
                '',
                chalk.bold('Before'),
                chalk.cyan('export default () => <div />;'),
                '',
                chalk.bold('After'),
                chalk.cyan('const Named = () => <div />;'),
                chalk.cyan('export default Named;'),
              ].join('\n')
            );
            break;
          }
          case 'FunctionDeclaration': {
            const isAnonymous = !Boolean(def.id);
            if (isAnonymous) {
              warn(
                [
                  chalk.yellow.bold(
                    'Anonymous function declarations cause Fast Refresh to not preserve local component state.'
                  ),
                  'Please add a name to your function, for example:',
                  '',
                  chalk.bold('Before'),
                  chalk.cyan('export default function () { /* ... */ }'),
                  '',
                  chalk.bold('After'),
                  chalk.cyan('export default function Named() { /* ... */ }'),
                ].join('\n')
              );
            }
            break;
          }
          default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const never = def;
          }
        }
      },
    },
  };
};
