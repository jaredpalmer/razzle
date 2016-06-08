import jackrabbit from 'jackrabbit'
import { Router } from 'express'

const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672';
const EXPIRATION = process.env.SERVICE_TIME || 3000;
const router = new Router()
const rabbit = jackrabbit(RABBIT_URL)
const exchange = rabbit.default()

/**
 * GET returns all posts
 */
router.get('/', (req, res, next) => {
  // Ask the posts service to get all posts

  exchange.publish({}, {
    expiration: EXPIRATION, // timeout after 3 sec
    key: 'posts.getAll', // publish topic on exchange
    reply (data) { // handle the response
      const status = data.error ? data.error_code : 200
      res.status(status).json(data)
    }
  })
})

/**
 * GET finds a post by it's slug
 */
router.get('/:slug', getPost, (req, res, next) => {
  const data = res.locals.data
  const status = data.error_code ? data.error_code : 200
  res.status(status).json(data)
})

// Sometimes it makes sense to write publish functions as middleware so you can
// run several of them in parallel. See docs for example.
function getPost (req, res, next) {
  // ask posts service for a single post
  exchange.publish({ slug: req.params.slug }, {
    expiration: EXPIRATION,
    key: 'posts.get',
    reply (data) {
      res.locals.data = data
      next()
    }
  })
}

module.exports = router
