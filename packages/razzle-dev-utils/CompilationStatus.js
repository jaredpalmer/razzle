const { Component, Text, h, render } = require('ink');
const Spinner = require('ink-spinner');
const { default: Console, LogCatcher } = require('ink-console');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');

const logCatcher = new LogCatcher();

class CompilationStatus extends Component {
  static startRender(compilers) {
    render(h(CompilationStatus, { compilers }));
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      web: {
        compiling: true,
        hasErrors: false,
        hasWarnings: false,
      },
      node: {
        compiling: true,
        hasErrors: false,
        hasWarnings: false,
      },
    };
  }

  render() {
    return h(
      'div',
      null,
      this.getIndicator('web'),
      ' Client',
      h('br'),
      this.getIndicator('node'),
      ' Server',
      h('br'),
      h('br'),
      h(Console, {
        lines: 15,
        logCatcher: logCatcher,
      })
    );
  }

  componentDidMount() {
    // hook ourselves into the plugins
    for (const compiler of this.props.compilers) {
      compiler.plugin('invalid', () =>
        this.invalidate(compiler.options.target)
      );
      compiler.plugin('done', stats =>
        this.done(compiler.options.target, stats)
      );
    }
  }

  getIndicator(target) {
    if (this.state[target].compiling) {
      return h(Spinner, { yellow: true });
    } else if (this.state[target].hasErrors) {
      return h(Text, { red: true }, '✘');
    } else {
      return h(
        Text,
        !this.state[target].hasWarnings ? { green: true } : { yellow: true },
        '✔︎'
      );
    }
  }

  done(target, stats) {
    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);
    const hasErrors =
      messages.errors.length &&
      !(
        rawMessages.errors &&
        rawMessages.errors.length > 0 &&
        (rawMessages.errors[0].includes('assets.json') ||
          rawMessages.errors[0].includes("Module not found: Can't resolve"))
      );
    const hasWarnings = !!messages.warnings.length;

    this.setState({
      [target]: {
        compiling: false,
        hasErrors,
        hasWarnings,
      },
    });
  }

  invalidate(target) {
    // super hacky method to clear console.
    // perhaps file a PR to ink-console at some point?
    if (logCatcher && !process.env.VERBOSE) {
      logCatcher._log = [];
      for (const value of logCatcher._handlers) {
        value();
      }
    }

    this.setState({
      [target]: {
        compiling: true,
      },
    });
  }
}

module.exports = CompilationStatus;
