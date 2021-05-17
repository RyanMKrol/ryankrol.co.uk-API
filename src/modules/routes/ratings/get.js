import createError from 'http-errors';
import cacheCollection from '../../data/cache';

import { getAlbumRatings, getMovieRatings } from '../../data/ratings';

const CACHE_TTL_MINUTES = 60 * 24;

const albumRatingsCache = cacheCollection.registerCache('albumRatings', CACHE_TTL_MINUTES, () => getAlbumRatings());
const movieRatingsCache = cacheCollection.registerCache('movieRatings', CACHE_TTL_MINUTES, () => getMovieRatings());

/**
 * Creates the GET routes for the ratings API
 *
 * @param {object} router Express router object
 */
function createGetRoutes(router) {
  // fetch all album ratings
  router.get('/album', async (req, res, next) => {
    try {
      const data = await albumRatingsCache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all movie ratings
  router.get('/movie', async (req, res, next) => {
    try {
      const data = await movieRatingsCache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });
}

export default createGetRoutes;
