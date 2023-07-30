import NodeCache from 'node-cache';
import express from 'express';
import { DYNAMO_TABLES } from '../../lib/constants';
import { fetchThumbnailForMovie } from '../../lib/remote/omdb';
import cacheReadthrough from '../../lib/cache';
import { getWriteQueueInstance, scanTable } from '../../lib/dynamo';
import {
  handlerWithOptionalMiddleware,
  withAuthentication,
  withDateTracking,
  withRequestBodyModification,
  withRequiredBodyKeys,
} from '../../lib/middleware';

const CACHE = new NodeCache();

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
      'blind',
      'characters',
      'craftsmanship',
      'gist',
      'sound',
      'story',
    ]),
    withRequestBodyModification(addThumbnail),
    withRequiredBodyKeys(['thumbnail']),
    handlePost,
  );
});

/**
 * Handles GET requests to this API
 * @returns {object} The response object
 */
async function handleGet() {
  // can use filename as the key here because this is
  // the only file interacting with this cache object
  return cacheReadthrough(
    CACHE,
    __filename,
    async () => scanTable(DYNAMO_TABLES.MOVIE_RATINGS_TABLE),
  );
}

/**
 * Handles POST requests to this API
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePost(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(DYNAMO_TABLES.MOVIE_RATINGS_TABLE);
    writeQueue.push(req.body, () => {
      CACHE.flushAll();
      resolve({ status: 200, message: 'Successful POST' });
    });
  });
}

/**
 * Add a thumbnail for the movie to the request
 * @param {Request} req request
 */
async function addThumbnail(req) {
  req.body.thumbnail = await fetchThumbnailForMovie(req.body.title);
}

export default router;
