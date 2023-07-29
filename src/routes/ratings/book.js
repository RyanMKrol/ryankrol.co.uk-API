import NodeCache from 'node-cache';
import express from 'express';
import ONE_HOUR_S from '../../lib/constants';
import cacheReadthrough from '../../lib/cache';
import { getWriteQueueInstance, scanTable } from '../../lib/dynamo';
import {
  handlerWithOptionalMiddleware,
  withAuthentication,
  withDateTracking,
  withRequestBodyModification,
  withRequiredBodyKeys,
} from '../../lib/middleware';
import fetchRemoteInfoForBook from '../../lib/remote/googleBooks';

const router = express.Router();

const BOOK_RATINGS_TABLE = 'BookRatings';
const CACHE = new NodeCache({ stdTTL: ONE_HOUR_S });

router.get('/', async (req, res) => {
  handlerWithOptionalMiddleware(req, res, handleGet);
});

router.post('/', (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    withDateTracking,
    withRequiredBodyKeys(['title', 'author', 'date', 'rating']),
    withRequestBodyModification(addBookInfo),
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
  return cacheReadthrough(CACHE, __filename, async () => scanTable(BOOK_RATINGS_TABLE));
}

/**
 * Handles POST requests to this API
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePost(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(BOOK_RATINGS_TABLE);
    writeQueue.push(req.body, () => {
      resolve({ status: 200, message: 'Successful POST' });
    });
  });
}

/**
 * Calls the GoogleBooks API to find information like the thumbnail,
 * and publish date for the book
 * @param {Request} req request
 */
async function addBookInfo(req) {
  const book = await fetchRemoteInfoForBook(req.body.title, req.body.author);
  req.body = { ...req.body, ...book };
}

export default router;