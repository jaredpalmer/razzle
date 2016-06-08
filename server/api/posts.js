import jackrabbit from 'jackrabbit'
import { Router } from 'express'

const RABBIT_URL = process.env.CLOUDAMQP_URL || 'amqp://guest:guest@localhost:5672';
const EXPIRATION = process.env.SERVICE_TIME || 3000;
const router = new Router()
const rabbit = jackrabbit(RABBIT_URL)
const exchange = rabbit.default()

/**
 * GET Call posts service to get all posts
 */
router.get('/', getAllPosts, (req, res, next) => {
  const data = res.locals.data;
  const status = data.error_code ? data.error_code : 200;
  res.status(status).json(data);
});

function getAllPosts (req, res, next) {
  exchange.publish({}, {
    expiration: EXPIRATION,
    key: 'posts.get',
    reply(data) {
      res.locals.data = data;
      next();
    },
  });
}

/**
 * GET Call posts service to get all posts
 */
router.get('/:slug', getPost, (req, res, next) => {
  const data = res.locals.data;
  const status = data.error_code ? data.error_code : 200;
  res.status(status).json(data);
});

function getPost (req, res, next) {
  exchange.publish({ slug: req.params.slug }, {
    expiration: EXPIRATION,
    key: 'post.get',
    reply (data) {
      res.locals.data = data;
      next();
    },
  });
}


module.exports = router;
