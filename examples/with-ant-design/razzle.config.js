module.exports = {
  modify: (config, { target, dev }, webpack) => {
    const targetName = target === 'node' ? 'server' : 'client'
    return require(`./webpack/${targetName}`)(config, webpack)
  },
}
