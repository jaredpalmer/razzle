const commonjsPlugin = require('@babel/plugin-transform-modules-commonjs');

module.exports = function () {
  const commonjs = commonjsPlugin.apply(null, arguments)
  return {
    visitor: {
      Program: {
        exit: function (path, state) {
          let foundModuleExports = false
          path.traverse({
            MemberExpression: function(expressionPath) {
              if (expressionPath.node.object.name !== 'module') return
              if (expressionPath.node.property.name !== 'exports') return
              foundModuleExports = true
            },
          })

          if (!foundModuleExports) {
            return
          }

          commonjs.visitor.Program.exit.call(this, path, state)
        },
      },
    },
  }
}
