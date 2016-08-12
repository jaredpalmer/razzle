// Shamelessly ripped from FB's create-react-app

var chalk = require('chalk')
var opn = require('opn')
var execSync = require('child_process').execSync
var path = require('path')

var port = process.env.PORT || 5000
var compiler

function clearConsole() {
  process.stdout.write('\x1B[2J\x1B[0f')
}


var friendlySyntaxErrorLabel = 'Syntax error:'

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1
}

// This is a little hacky.
// It would be easier if webpack provided a rich error object.

function formatMessage(message) {
  return message
    // Make some common errors shorter:
    .replace(
      // Babel syntax error
      'Module build failed: SyntaxError:',
      friendlySyntaxErrorLabel
    )
    .replace(
      // Webpack file not found error
      /Module not found: Error: Cannot resolve 'file' or 'directory'/,
      'Module not found:'
    )
    // Internal stacks are generally useless so we strip them
    .replace(/^\s*at\s.*:\d+:\d+[\s\)]*\n/gm, '') // at ... ...:x:y
    // Webpack loader names obscure CSS filenames
    .replace('./~/css-loader!./~/postcss-loader!', '')
}

exports.compileDev = function (compiler)  {
  compiler.plugin('invalid', function() {
    clearConsole()
    console.log('Compiling...')
  })
  compiler.plugin('done', function(stats) {
    clearConsole()
    var hasErrors = stats.hasErrors()
    var hasWarnings = stats.hasWarnings()
    if (!hasErrors && !hasWarnings) {
      console.log(chalk.green('Compiled successfully!'))
      console.log()
      console.log('The app is running at http://localhost:' + port + '/')
      console.log()
      console.log()
      return
    }

    var json = stats.toJson()
    var formattedErrors = json.errors.map(message =>
      'Error in ' + formatMessage(message)
    )
    var formattedWarnings = json.warnings.map(message =>
      'Warning in ' + formatMessage(message)
    )

    if (hasErrors) {
      console.log(chalk.red('Failed to compile.'))
      console.log()
      if (formattedErrors.some(isLikelyASyntaxError)) {
        // If there are any syntax errors, show just them.
        // This prevents a confusing ESLint parsing error
        // preceding a much more useful Babel syntax error.
        formattedErrors = formattedErrors.filter(isLikelyASyntaxError)
      }
      formattedErrors.forEach(message => {
        console.log(message)
        console.log()
      })
      // If errors exist, ignore warnings.
      return
    }

    if (hasWarnings) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()
      formattedWarnings.forEach(message => {
        console.log(message)
        console.log()
      })

      console.log('You may use special comments to disable some warnings.')
      console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.')
      console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.')
    }
  })

  return compiler
}


function openBrowser (port) {
  if (process.platform === 'darwin') {
    try {
      // Try our best to reuse existing tab
      // on OS X Google Chrome with AppleScript
      execSync('ps cax | grep "Google Chrome"');
      execSync(
        'osascript ' +
        path.resolve(__dirname, 'chrome.applescript') +
        ' http://localhost:' + port + '/'
      )
      return
    } catch (err) {
      // Ignore errors.
    }
  }
  // Fallback to opn
  // (It will always open new tab)
  opn('http://localhost:' + port + '/')
}

exports.listen = function (port, err) {
  process.stdout.write('\x1B[2J\x1B[0f')
  if (err) console.log(chalk.red(err))
  console.log(chalk.cyan('Starting the development server...'))
  console.log()
  openBrowser(port)
}
