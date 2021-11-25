import chalk from 'chalk';

const logTypes = {
  warn: {
    bg: 'bgYellow',
    msg: ' WARNING ',
    text: 'yellow',
  },
  debug: {
    bg: 'bgMagenta',
    msg: ' DEBUG ',
    text: 'magenta',
  },
  info: {
    bg: 'bgCyan',
    msg: ' INFO ',
    text: 'cyan',
  },
  error: {
    bg: 'bgRed',
    msg: ' ERROR ',
    text: 'red',
  },
  start: {
    bg: 'bgBlue',
    msg: ' WAIT ',
    text: 'blue',
  },
  done: {
    bg: 'bgGreen',
    msg: ' DONE ',
    text: 'green',
  },
};

const write = (type: string, text: string, verbose?: boolean| unknown | undefined): void => {
  let textToLog = '';
  let logObject = false;

  const logType = logTypes[type];

  textToLog +=
    chalk[logType.bg].black(logType.msg) + ' ' + chalk[logType.text](text);

  // Adds optional verbose output
  if (verbose) {
    if (typeof verbose === 'object') {
      logObject = true;
    } else {
      textToLog += `\n\n${verbose}`;
    }
  }

  console.log(textToLog);
  if (['start', 'done', 'error'].indexOf(type) > -1) {
    console.log();
  }

  if (logObject) console.dir(verbose, { depth: 15 });
};

// Printing any statements
const log = (text = '') => console.log(text);

// Starting a process
const start = (text: string) => {
  write('start', text);
};

// Ending a process
const done = (text: string) => {
  write('done', text);
};

// Info about a process task
const info = (text: string) => {
  write('info', text);
};

// Verbose output
// takes optional data
const debug = (text: string, data: unknown) => {
  write('debug', text, data);
};

// Warn output
const warn = (text: string, data: unknown) => {
  write('warn', text, data);
};

// Error output
// takes an optional error
const error = (text: string, err: unknown) => {
  write('error', text, err);
};

export default {
  log,
  info,
  debug,
  warn,
  error,
  start,
  done,
};