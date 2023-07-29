import NodeCache from 'node-cache';
import express from 'express';
import { ONE_DAY_S } from '../lib/constants';
import { fetchRecentListens } from '../lib/remote/lastFm';
import cacheReadthrough from '../lib/cache';
import {
  handlerWithOptionalMiddleware,
} from '../lib/middleware';

const CACHE = new NodeCache({ stdTTL: ONE_DAY_S });

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
    CACHE,
    __filename,
    async () => fetchRecentListens(),
  );
}

export default router;
