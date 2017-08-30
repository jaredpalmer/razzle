const { Component, Text, h, render } = require('ink');
const Spinner = require('ink-spinner');
const { default: Console } = require('ink-console');
const LogCatcher = require('./LogCatcher');
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
        valid: false,
      },
      node: {
        compiling: true,
        valid: false,
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
      h(Console, { lines: 20, logCatcher: logCatcher })
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
    } else if (!this.state[target].valid) {
      return h(Text, { red: true }, '✘');
    } else {
      return h(Text, { green: true }, '✔︎');
    }
  }

  done(target, stats) {
    const rawMessages = stats.toJson({}, true);
    const messages = formatWebpackMessages(rawMessages);
    const valid = !messages.errors.length && !messages.warnings.length; // todo warning indicator?

    this.setState({
      [target]: {
        compiling: false,
        valid,
      },
    });
  }

  invalidate(target) {
    this.setState({
      [target]: {
        compiling: true,
      },
    });
  }
}

module.exports = CompilationStatus;
