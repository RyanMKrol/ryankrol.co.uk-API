import createError from 'http-errors';
import cacheCollection from '../../data/cache';

import {
  getAlbumRatings,
  getBookRatings,
  getMovieRatings,
  getTelevisionRatings,
} from '../../data/ratings';

const ALBUM_CACHE_NAME = 'albumRatings';
const BOOK_CACHE_NAME = 'bookRatings';
const MOVIE_CACHE_NAME = 'movieRatings';
const TV_CACHE_NAME = 'televisionRatings';
const CACHE_TTL_MINUTES = 60 * 24;

/**
 * Creates the GET routes for the ratings API
 *
 * @param {object} router Express router object
 */
function createGetRoutes(router) {
  // fetch all album ratings
  router.get('/album', async (req, res, next) => {
    const cache = await cacheCollection.getCache(ALBUM_CACHE_NAME);

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all book ratings
  router.get('/book', async (req, res, next) => {
    const cache = await cacheCollection.getCache(BOOK_CACHE_NAME);

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all movie ratings
  router.get('/movie', async (req, res, next) => {
    const cache = await cacheCollection.getCache(MOVIE_CACHE_NAME);

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all movie ratings
  router.get('/tv', async (req, res, next) => {
    const cache = await cacheCollection.getCache(TV_CACHE_NAME);

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });
}

/**
 * Method to create cache for our album ratings API
 */
(async () => {
  cacheCollection.registerCache(ALBUM_CACHE_NAME, CACHE_TTL_MINUTES, () => getAlbumRatings());
})();

/**
 * Method to create cache for our book ratings API
 */
(async () => {
  cacheCollection.registerCache(BOOK_CACHE_NAME, CACHE_TTL_MINUTES, () => getBookRatings());
})();

/**
 * Method to create cache for our movie ratings API
 */
(async () => {
  cacheCollection.registerCache(MOVIE_CACHE_NAME, CACHE_TTL_MINUTES, () => getMovieRatings());
})();

/**
 * Method to create cache for our television ratings API
 */
(async () => {
  cacheCollection.registerCache(TV_CACHE_NAME, CACHE_TTL_MINUTES, () => getTelevisionRatings());
})();

export default createGetRoutes;
