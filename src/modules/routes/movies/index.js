// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../data/cache';
import getMovies from '../../data/movies';

const CACHE_TTL_MINUTES = 60 * 24 * 7;

let moviesCache = null;

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
  if (!moviesCache) {
    moviesCache = await cacheCollection.registerCache('movies', CACHE_TTL_MINUTES, () => getMovies());
  }

  return moviesCache;
}

export default router;
