// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../data/cache';
import getListens from '../../data/listens';

const CACHE_TTL_MINUTES = 60 * 24 * 7;

let listensCache = null;

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
  if (!listensCache) {
    listensCache = await cacheCollection.registerCache('listens', CACHE_TTL_MINUTES, () => getListens());
  }

  return listensCache;
}

export default router;
