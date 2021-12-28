import createError from 'http-errors';
import cacheCollection from '../../data/cache';

import { getVinylCollection } from '../../data/vinyl';

const VINYL_CACHE_NAME = 'vinylCollection';
const CACHE_TTL_MINUTES = 60 * 24;

/**
 * Creates the GET routes for the vinyl API
 *
 * @param {object} router Express router object
 */
function createGetRoutes(router) {
  // fetch all vinyl items
  router.get('/', async (req, res, next) => {
    const cache = await cacheCollection.getCache(VINYL_CACHE_NAME);

    try {
      const data = await cache.call();
      res.send(data);
    } catch (e) {
      next(createError(500));
    }
  });
}

/**
 * Method to create cache for our vinyl collection API
 */
(async () => {
  cacheCollection.registerCache(VINYL_CACHE_NAME, CACHE_TTL_MINUTES, () => getVinylCollection());
})();

export default createGetRoutes;
