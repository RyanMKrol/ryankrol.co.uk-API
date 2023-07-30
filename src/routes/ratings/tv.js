import express from 'express';
import { DYNAMO_TABLES, SERVER_CACHES } from '../../lib/constants';
import { fetchThumbnailForTvSeries } from '../../lib/remote/omdb';
import cacheReadthrough from '../../lib/cache';
import { getWriteQueueInstance, scanTable } from '../../lib/dynamo';
import {
  handlerWithOptionalMiddleware,
  withAuthentication,
  withDateTracking,
  withRequestBodyModification,
  withRequiredBodyKeys,
} from '../../lib/middleware';

const router = express.Router();

router.get('/', (req, res) => {
  handlerWithOptionalMiddleware(req, res, handleGet);
});

router.post('/', (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    withDateTracking,
    withRequiredBodyKeys([
      'title',
      'gist',
      'overallScore',
      'storyScore',
      'craftsmanshipScore',
      'soundScore',
      'characterScore',
    ]),
    withRequestBodyModification(addThumbnail),
    withRequiredBodyKeys(['thumbnail']),
    handlePost,
  );
});

/**
 * Handles GET requests
 * @returns {object} The response object
 */
async function handleGet() {
  // can use filename as the key here because this is
  // the only file interacting with this cache object
  return cacheReadthrough(
    SERVER_CACHES.TV_CACHE,
    __filename,
    async () => scanTable(DYNAMO_TABLES.TV_RATINGS_TABLE),
  );
}

/**
 * Handles POST requests
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePost(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(DYNAMO_TABLES.TV_RATINGS_TABLE);
    writeQueue.push(req.body, () => {
      SERVER_CACHES.TV_CACHE.flushAll();
      resolve({ status: 200, message: 'Successful POST' });
    });
  });
}

/**
 * Add a thumbnail for the tv series to the request
 * @param {Request} req request
 */
async function addThumbnail(req) {
  req.body.thumbnail = await fetchThumbnailForTvSeries(req.body.title);
}

export default router;
