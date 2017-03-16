#! /usr/bin/env node
const webpack = require('webpack');
const config = require('./webpack.config.server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const chalk = require('chalk');
const compiler = webpack(config);

compiler.plugin('invalid', function() {
  console.log(chalk.cyan('Compiling...'));
});

compiler.plugin('done', function(stats) {
  var rawMessages = stats.toJson({}, true);
  var messages = formatWebpackMessages(rawMessages);
  if (!messages.errors.length && !messages.warnings.length) {
    console.log(chalk.green('Compiled successfully!'));
  }
  if (messages.errors.length) {
    console.log(chalk.red('Failed to compile.'));
    messages.errors.forEach(e => console.log(e));
    return;
  }
  if (messages.warnings.length) {
    console.log(chalk.yellow('Compiled with warnings.'));
    messages.warnings.forEach(w => console.log(w));
  }
});

compiler.watch(
  {
    noInfo: true,
    stats: 'none',
  },
  (err, stats) => {
    if (err) {
      console.log(err);
    }
  }
);
