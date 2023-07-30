import express from 'express';
import { DYNAMO_TABLES, SERVER_CACHES } from '../../lib/constants';
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

router.get('/', (req, res) => {
  handlerWithOptionalMiddleware(req, res, handleGet);
});

router.post('/', (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    withDateTracking,
    withRequiredBodyKeys(['title', 'author', 'date', 'rating', 'overview']),
    withRequestBodyModification(addBookInfo),
    withRequiredBodyKeys(['thumbnail']),
    handlePost,
  );
});

router.put('/', (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    withRequiredBodyKeys(['title', 'author', 'rating', 'overview', 'thumbnail']),
    handlePut,
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
    SERVER_CACHES.BOOK_CACHE,
    __filename,
    async () => scanTable(DYNAMO_TABLES.BOOK_RATINGS_TABLE),
  );
}

/**
 * Handles POST requests to this API
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePost(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(DYNAMO_TABLES.BOOK_RATINGS_TABLE);
    writeQueue.push(req.body, () => {
      SERVER_CACHES.BOOK_CACHE.flushAll();
      resolve({ status: 200, message: 'Successful POST' });
    });
  });
}

/**
 * Handles PUT requests to this API
 * @param {Request} req request
 * @returns {object} The response object
 */
async function handlePut(req) {
  return new Promise((resolve) => {
    const writeQueue = getWriteQueueInstance(DYNAMO_TABLES.BOOK_RATINGS_TABLE);
    writeQueue.push(req.body, () => {
      SERVER_CACHES.BOOK_CACHE.flushAll();
      resolve({ status: 200, message: 'Successful PUT' });
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
