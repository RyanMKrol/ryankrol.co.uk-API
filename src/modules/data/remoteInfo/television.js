import fs from 'fs';
import apiCall from '../shared/utils';
import { TelevisionThumbnailNotFound } from '../../errors';

const CONFIG = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../credentials/omdbCredentials.json`),
);

/**
 * Fetches a thumbnail for a television series
 *
 * @param {string} title Title of the series
 * @returns {JSON} The data for the series
 */
async function fetchThumbnailForTelevision(title) {
  const searchInput = encodeURI(title);
  const apiEndpoint = `http://www.omdbapi.com/?apikey=${CONFIG.apiKey}&t=${searchInput}&type=series`;

  const data = await apiCall(apiEndpoint);

  if (!isTelevisionDataValid(data)) {
    throw new TelevisionThumbnailNotFound('Could not find series poster');
  }

  return data.Poster;
}

/**
 * Validates the API response
 *
 * @param {JSON} item API response
 * @returns {boolean} Whether the response is valid
 */
function isTelevisionDataValid(item) {
  return item.Poster && item.Poster !== 'N/A';
}

export default fetchThumbnailForTelevision;
