// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../data/cache';
import getBooks from '../../data/books';

const CACHE_TTL_MINUTES = 60 * 24 * 7;

let booksCache = null;

const router = express.Router();

router.get('/', async (req, res, next) => {
  const cache = await getCache();

  try {
    const data = await cache.call();
    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

/**
 * Method to fetch cache for our API
 *
 * @returns {Cache} an instance of a cache
 */
async function getCache() {
  if (!booksCache) {
    booksCache = await cacheCollection.registerCache('books', CACHE_TTL_MINUTES, () => getBooks());
  }

  return booksCache;
}

export default router;
