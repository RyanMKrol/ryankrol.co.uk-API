import NodeCache from 'node-cache';
import express from 'express';
import { DYNAMO_TABLES, ONE_DAY_S } from '../lib/constants';
import fetchThumbnailForAlbum from '../lib/remote/lastFm';
import cacheReadthrough from '../lib/cache';
import { getWriteQueueInstance, scanTable } from '../lib/dynamo';
import {
  handlerWithOptionalMiddleware,
  withAuthentication,
  withDateTracking,
  withRequestBodyModification,
  withRequiredBodyKeys,
} from '../lib/middleware';

const CACHE = new NodeCache({ stdTTL: ONE_DAY_S });

const router = express.Router();

router.get('/', async (req, res) => {
  handlerWithOptionalMiddleware(req, res, handleGet);
});

router.post('/', (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    withDateTracking,
    withRequiredBodyKeys(['title', 'artist', 'date']),
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
    async () => scanTable(DYNAMO_TABLES.VINYL_COLLECTION_TABLE),
  );
}

/**
 * Handles POST requests to this API
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePost(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(DYNAMO_TABLES.VINYL_COLLECTION_TABLE);
    writeQueue.push(req.body, () => {
      resolve({ status: 200, message: 'Successful POST' });
    });
  });
}

/**
 * Method to be run by middleware to add a thumbnail to the request
 * @param {Request} req request
 */
async function addThumbnail(req) {
  const thumbnail = await fetchThumbnailForAlbum(
    req.body.artist,
    req.body.title,
  );
  req.body.thumbnail = thumbnail;
}

export default router;
