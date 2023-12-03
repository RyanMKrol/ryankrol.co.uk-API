import express from 'express';
import groupBy from 'lodash.groupby';

import { DYNAMO_TABLES, SERVER_CACHES } from '../lib/constants';
import cacheReadthrough from '../lib/cache';
import { scanTable } from '../lib/dynamo';
import {
  handlerWithOptionalMiddleware,
} from '../lib/middleware';

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
    SERVER_CACHES.CONCERTS_CACHE,
    __filename,
    async () => getConcertData(),
  );
}

/**
 * Method to get the concert data we want to return
 * @returns {object} A map of date:{concertInfo}
 */
async function getConcertData() {
  const rawData = await scanTable(DYNAMO_TABLES.CONCERTS_TABLE);
  const filteredRawData = rawData.filter(
    (item) => new Date(item.date) > new Date(),
  );

  const sortedConcertData = filteredRawData.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);

    return aDate < bDate ? -1 : aDate === bDate ? 0 : 1;
  });

  return groupBy(sortedConcertData, 'date');
}

export default router;
