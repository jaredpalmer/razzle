const http = require('http')
const jackrabbit = require('jackrabbit')
const throng = require('throng')
const logger = require('logfmt')
const fakeDB = require('./fakeDB')

const CONCURRENCY = process.env.CONCURRENCY || 1
const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672'

http.globalAgent.maxSockets = Infinity

throng({
  workers: CONCURRENCY,
  lifetime: Infinity,
  start
})

function start() {
  const rabbit = jackrabbit(RABBIT_URL)
  const exchange = rabbit.default()
  logger.log({ type: 'info', message: 'serving posts service' })

  exchange
    .queue({ name: 'post.get' })
    .consume(onGetPost)

  exchange
    .queue({ name: 'posts.get' })
    .consume(onGetAllPosts)

  process.on('SIGTERM', process.exit)
  process.once('uncaughtException', onError)

  function onGetPost(message, reply) {
    logger.log(message)
    const timer = logger.time('post.get').namespace(message)
    const index = fakeDB.findIndex(el => el.slug === message.slug)
    if (index < 0) {
      reply({
        error: true,
        error_code: 500,
        error_message: 'Post not found'
      })
    }

    setTimeout(() => {
      timer.log()
      reply(fakeDB[index])
    }, 300)
  }

  function onGetAllPosts(message, reply) {
    logger.log(message)
    const timer = logger.time('posts.get').namespace(message)
    setTimeout(() => {
      timer.log()
      reply(fakeDB)
    }, 300)
  }

  function onError(err) {
    logger.log({
      type: 'error',
      service: 'post',
      error: err,
      stack: err.stack || 'No stacktrace',
    }, process.stderr)
    logger.log({ type: 'info', message: 'killing post service' })
    process.exit()
  }
}
