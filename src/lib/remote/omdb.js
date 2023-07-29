import { ThumbnailNotFound } from '../errors';

import 'dotenv/config';

/**
 * Validates the API response
 * @param {JSON} item API response
 * @returns {boolean} Whether the response is valid
 */
function isThumbnailValid(item) {
  return item.Poster && item.Poster !== 'N/A';
}

/**
 * Fetches a thumbnail
 * @param {string} apiEndpoint The endpoint to call for the thumbnail
 * @returns {JSON} The thumbnail
 */
async function fetchThumbnail(apiEndpoint) {
  const response = await fetch(apiEndpoint);
  const data = await response.json();

  if (!isThumbnailValid(data)) {
    throw new ThumbnailNotFound();
  }

  return data.Poster;
}

/**
 * Fetches a thumbnail for a movie title
 * @param {string} title Title of the movie
 * @returns {JSON} The thumbnail
 */
async function fetchThumbnailForMovie(title) {
  const searchInput = encodeURI(title);
  const apiEndpoint = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${searchInput}&type=movie`;

  return fetchThumbnail(apiEndpoint);
}

/**
 * Fetches a thumbnail for a tv series title
 * @param {string} title Title of the series
 * @returns {JSON} The thumbnail
 */
async function fetchThumbnailForTvSeries(title) {
  const searchInput = encodeURI(title);
  const apiEndpoint = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${searchInput}&type=series`;

  return fetchThumbnail(apiEndpoint);
}

export { fetchThumbnailForMovie, fetchThumbnailForTvSeries };
