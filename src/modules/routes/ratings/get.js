import createError from 'http-errors';
import cacheCollection from '../../data/cache';

import { getAlbumRatings, getMovieRatings } from '../../data/ratings';

const CACHE_TTL_MINUTES = 60 * 24;

let albumRatingsCache = null;
let movieRatingsCache = null;

/**
 * Creates the GET routes for the ratings API
 *
 * @param {object} router Express router object
 */
function createGetRoutes(router) {
  // fetch all album ratings
  router.get('/album', async (req, res, next) => {
    const cache = await getAlbumCache();

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all movie ratings
  router.get('/movie', async (req, res, next) => {
    const cache = await getMovieCache();

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });
}

/**
 * Method to fetch cache for our API
 *
 * @returns {Cache} an instance of a cache
 */
async function getAlbumCache() {
  if (!albumRatingsCache) {
    albumRatingsCache = await cacheCollection.registerCache('albumRatings', CACHE_TTL_MINUTES, () => getAlbumRatings());
  }

  return albumRatingsCache;
}

/**
 * Method to fetch cache for our API
 *
 * @returns {Cache} an instance of a cache
 */
async function getMovieCache() {
  if (!movieRatingsCache) {
    movieRatingsCache = await cacheCollection.registerCache('movieRatings', CACHE_TTL_MINUTES, () => getMovieRatings());
  }

  return movieRatingsCache;
}

export default createGetRoutes;
