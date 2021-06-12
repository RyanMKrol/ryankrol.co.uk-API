import fs from 'fs';
import apiCall from '../shared/utils';
import { MovieThumbnailNotFound } from '../../errors';

const CONFIG = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../credentials/omdbCredentials.json`),
);

/**
 * Fetches a thumbnail for a movie title
 *
 * @param {string} title Title of the movie
 * @returns {JSON} The data for the movie
 */
async function fetchThumbnailForMovie(title) {
  const searchInput = encodeURI(title);
  const apiEndpoint = `http://www.omdbapi.com/?apikey=${CONFIG.apiKey}&t=${searchInput}`;

  const data = await apiCall(apiEndpoint);

  if (!isMovieDataValid(data)) {
    throw new MovieThumbnailNotFound('Could not find movie poster');
  }

  return data.Poster;
}

/**
 * Validates the API response
 *
 * @param {JSON} item API response
 * @returns {boolean} Whether the response is valid
 */
function isMovieDataValid(item) {
  return item.Poster && item.Poster !== 'N/A';
}

export default fetchThumbnailForMovie;
