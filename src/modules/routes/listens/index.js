// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../cache';
import getListens from '../../data/listens';

const CACHE_TTL_MINUTES = 60 * 24;

const listensCache = cacheCollection.registerCache('listens', CACHE_TTL_MINUTES, () => getListens());

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await listensCache.call();
    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

export default router;
