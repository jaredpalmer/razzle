const http = require('http')
const jackrabbit = require('jackrabbit')
const throng = require('throng')
const logger = require('logfmt')
const fakeDB = require('./fakeDB')

const CONCURRENCY = process.env.CONCURRENCY || 2
const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672'

http.globalAgent.maxSockets = Infinity

// Throng is like a lightweight pmx (it wraps cluster)
throng({ workers: CONCURRENCY, lifetime: Infinity, start })

function start () {
  const rabbit = jackrabbit(RABBIT_URL)
  const exchange = rabbit.default()
  logger.log({ type: 'info', message: 'serving posts service' })

  // These can be split up into separate workers or bundled together like so.
  // They both talk to the same DB (i.e. fakeDB) so it makes sense to group them
  // together. Also, Heroku only gives you one worker dyno on its free-tier.
  // As you scale your app you may eventually move workers to a completely different
  // repository.
  exchange
    .queue({ name: 'posts.get' })
    .consume(onGetPost)

  function onGetPost (message, reply) {
    // log message and start a timer
    const timer = logger.time('posts.get').namespace(message)
    setTimeout(() => {
      const index = fakeDB.findIndex(el => el.slug === message.slug)
      timer.log() // track how long the service takes to respond
      if (index < 0) {
        // Reply to the publisher that the post doesn't exist.
        reply({
          error: true,
          error_code: 403,
          error_message: 'Post not found'
        })
      } else {
        reply(fakeDB[index])
      }
    }, 300)
  }

  exchange
    .queue({ name: 'posts.getAll' })
    .consume(onGetAllPosts)

  function onGetAllPosts (message, reply) {
    const timer = logger.time('posts.getAll').namespace(message)
    setTimeout(() => {
      timer.log()
      reply(fakeDB)
    }, 300)
  }

  process.on('SIGTERM', process.exit)
  process.once('uncaughtException', onError)

  // This is for internal errors, not for things like missing posts.
  function onError (err) {
    logger.log({
      type: 'error',
      service: 'posts',
      error: err,
      stack: err.stack || 'No stacktrace'
    }, process.stderr)
    logger.log({ type: 'info', message: 'killing posts service' })
    process.exit()
  }
}
