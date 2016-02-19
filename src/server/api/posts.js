import { Router } from 'express';
const router = new Router();

// Remove this
import fakeDB from '../fakeDB.js';

router.get('/', (req, res) => {
  // setTimeout(() => {
  //   res.statusCode = 200;
  //   res.json(fakeDB);
  // }, 500);
  res.statusCode = 200;
  res.json(fakeDB);
});

module.exports = router;
