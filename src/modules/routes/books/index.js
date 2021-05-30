// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../data/cache';
import getBooks from '../../data/books';

const CACHE_NAME = 'books';
const CACHE_TTL_MINUTES = 60 * 24 * 7;

const router = express.Router();

router.get('/', async (req, res, next) => {
  const cache = await cacheCollection.getCache(CACHE_NAME);

  try {
    const data = await cache.call();
    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

/**
 * Method to fetch cache for our books API
 */
(async () => {
  cacheCollection.registerCache(CACHE_NAME, CACHE_TTL_MINUTES, () => getBooks());
})();

export default router;
