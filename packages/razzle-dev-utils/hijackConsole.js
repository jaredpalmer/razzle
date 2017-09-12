// hijack the global console object and redirect it to the razzle binary, which uses a custom logger

for (const type of ['dir', 'log', 'info', 'warn', 'error']) {
  console[type] = (...args) => {
    process.send({
      cmd: 'console',
      type,
      args,
    });
  };
}
