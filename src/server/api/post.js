import { Router } from 'express';
const router = new Router();

// Remove this
import fakeDB from '../fakeDB.js';

router.get('/:slug', (req, res) => {
  const index = fakeDB.findIndex(el => el.slug === req.params.slug);
  if (index < 0) {
    res.statusCode = 500;
    res.json({
      error: 'Post does not exist in db',
    });
  }

  setTimeout(() => {
    res.statusCode = 200;
    res.json(fakeDB[index]);
  }, 300);
});

module.exports = router;
