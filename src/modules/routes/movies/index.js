// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../data/cache';
import getMovies from '../../data/movies';

const CACHE_TTL_MINUTES = 60 * 24;

const moviesCache = cacheCollection.registerCache('movies', CACHE_TTL_MINUTES, () => getMovies());

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await moviesCache.call();
    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

export default router;
