import createError from 'http-errors';
import cacheCollection from '../../cache';

const CACHE_TTL_MINUTES = 60 * 24;

const movieRatingsCache = cacheCollection.registerCache('movieRatings', CACHE_TTL_MINUTES, () => {
  console.log('here are your movie ratings');
  return {
    ratings: [],
  };
});

const albumRatingsCache = cacheCollection.registerCache('albumRatings', CACHE_TTL_MINUTES, () => {
  console.log('here are your album ratings');
  return {
    ratings: [],
  };
});

/**
 * Creates the GET routes for the ratings API
 *
 * @param {object} router Express router object
 */
function createGetRoutes(router) {
  // fetch all movie ratings
  router.get('/movie', async (req, res, next) => {
    try {
      const data = await movieRatingsCache.call();

      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });

  // fetch all album ratings
  router.get('/album', async (req, res, next) => {
    try {
      const data = await albumRatingsCache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });
}

export default createGetRoutes;
