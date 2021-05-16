// routes/albums.js
import express from 'express';
import createError from 'http-errors';

import cacheCollection from '../../cache';
import getBooks from '../../data/books';

const CACHE_TTL_MINUTES = 60 * 24;

const booksCache = cacheCollection.registerCache('books', CACHE_TTL_MINUTES, () => getBooks());

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await booksCache.call();
    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

export default router;
