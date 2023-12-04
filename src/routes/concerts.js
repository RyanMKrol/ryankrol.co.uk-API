import express from 'express';
import groupBy from 'lodash.groupby';

import 'dotenv/config';

import { fetchArtistListensForPeriod } from '../lib/remote/lastFm';
import { DYNAMO_TABLES, SERVER_CACHES, LAST_FM_LISTENING_PERIODS } from '../lib/constants';
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

  const decoratedData = await decorateRawData(sortedConcertData);

  return groupBy(decoratedData, 'date');
}

/**
 * Coordinates decorator functions, incrementing the score each time
 * @param {object[]} concertData - An array of concert data objects
 * @returns {object[]} An array of concert data objects
 */
async function decorateRawData(concertData) {
  return Promise.resolve(concertData.reduce((acc, val) => {
    acc.push({ ...val, score: 0 });
    return acc;
  }, []))
    .then((data) => decorateWithVenuePreferences(data))
    .then((data) => decorateWithArtistPreferences(data));
}

/**
 * Enhances each concert data entry with a score based on preferred artists.
 * @param {object[]} concertData - An array of concert data objects. Each object
 *  should contain at least 'artist' and 'score' properties.
 * @returns {object[]} An array of concert data objects, each possibly modified with
 * an increased score if the artist is preferred.
 */
async function decorateWithArtistPreferences(concertData) {
  const artists = await Promise.all([
    fetchArtistListensForPeriod(
      LAST_FM_LISTENING_PERIODS.ONE_MONTH,
      10,
    ),
    fetchArtistListensForPeriod(
      LAST_FM_LISTENING_PERIODS.SIX_MONTHS,
      20,
    ),
    fetchArtistListensForPeriod(
      LAST_FM_LISTENING_PERIODS.OVERALL,
      30,
    )])
    .then((data) => data.flat()) // flatten the 3 calls into one dataset
    .then((data) => [...new Set(data)]) // remove duplicates from the dataset
    .then((data) => data.map((val) => val.toLowerCase())); // set the artist names to lower case

  return concertData.reduce((acc, val) => {
    if (artists.some((artist) => val.artist.toLowerCase().includes(artist))) {
      acc.push({
        ...val,
        score: val.score + 3,
      });
    } else {
      acc.push(val);
    }

    return acc;
  }, []);
}

/**
 * Enhances each concert data entry with a score based on preferred venues.
 * This function iterates over each concert data object in the `concertData` array,
 * checking if the venue is included in the list of preferred venues (defined in
 * environment variables). If a concert's venue is in the preferred list, its
 * score is incremented by 1.
 * @param {object[]} concertData - An array of concert data objects. Each object
 *  should contain at least 'venue' and 'score' properties.
 * @returns {object[]} An array of concert data objects, each possibly modified with
 * an increased score if the venue is preferred.
 */
function decorateWithVenuePreferences(concertData) {
  const preferredVenues = process.env.PREFERRED_VENUES.split(',').map((val) => val.toLowerCase());

  return concertData.reduce((acc, val) => {
    if (preferredVenues.some((venue) => val.venue.toLowerCase().includes(venue))) {
      acc.push({
        ...val,
        score: val.score + 1,
      });
    } else {
      acc.push(val);
    }

    return acc;
  }, []);
}

export default router;
