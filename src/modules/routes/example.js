import express from 'express';

import cacheCollection from '../cache';

const router = express.Router();

const cache = cacheCollection.registerCache('example', 5, () => 5);

// eslint-disable-next-line no-unused-vars
router.get('/', async (req, res, next) => {
  try {
    const data = await cache.call();
    res.send(`Data! - ${data}`);
  } catch (e) {
    res.send('Error!');
  }
});

export default router;
