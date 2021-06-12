import fs from 'fs';
import apiCall from '../shared/utils';
import { AlbumThumbnailNotFound } from '../../errors';

const CONFIG = JSON.parse(fs.readFileSync(`${__dirname}/../../../../credentials/lastfm.json`));

/**
 * Fetches a thumbnail for an album
 *
 * @param {string} artist The artist on the album
 * @param {string} title The artist on the title
 * @returns {JSON} The data for the movie
 */
async function fetchThumbnailForAlbum(artist, title) {
  const artistInput = encodeURI(artist);
  const titleInput = encodeURI(title);
  const apiEndpoint = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${CONFIG.apiKey}&artist=${artistInput}&album=${titleInput}&format=json`;

  const data = await apiCall(apiEndpoint);

  if (!isAlbumDataValid(data)) {
    throw new AlbumThumbnailNotFound('Could not find album thumbnail');
  }

  return getLargeAlbumImage(data)[0]['#text'];
}

/**
 * Validates the API response
 *
 * @param {JSON} item API response
 * @returns {boolean} Whether the response is valid
 */
function isAlbumDataValid(item) {
  return item.album && item.album.image && getLargeAlbumImage(item).length === 1;
}

/**
 * Pulls the album image out of the API response
 *
 * @param {JSON} item API response
 * @returns {Array<JSON>} Array containing either a large image URL, or nothing
 */
function getLargeAlbumImage(item) {
  return item.album.image.filter((x) => x.size === 'extralarge');
}

export default fetchThumbnailForAlbum;
