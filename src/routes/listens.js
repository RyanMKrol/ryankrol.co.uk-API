import express from 'express';
import { fetchRecentListens } from '../lib/remote/lastFm';
import cacheReadthrough from '../lib/cache';
import {
  handlerWithOptionalMiddleware,
} from '../lib/middleware';
import { SERVER_CACHES } from '../lib/constants';

const router = express.Router();

router.get('/', async (req, res) => {
  handlerWithOptionalMiddleware(req, res, handleGet);
});

/**
 * Handles GET requests to this API
 * @returns {object} The response object
 */
async function handleGet() {
  // can use filename as the key here because this is
  // the only file interacting with this cache object
  return cacheReadthrough(
    SERVER_CACHES.LISTENS_CACHE,
    __filename,
    async () => fetchRecentListens(),
  );
}

export default router;
