import { ThumbnailNotFound } from '../errors';

import 'dotenv/config';

const EMPTY_THUMBNAIL_LINK = '';

/**
 * Pulls the album image out of the API response
 * @param {JSON} data API response
 * @returns {string} The URL to the thumbnail
 */
function getThumbnailUrl(data) {
  const largeAlbumImageItemResult = data.album.image.filter(
    (x) => x.size === 'extralarge',
  );

  return largeAlbumImageItemResult.length === 1
    ? largeAlbumImageItemResult[0]['#text']
    : EMPTY_THUMBNAIL_LINK;
}

/**
 * Validates the API response
 * @param {JSON} data API response
 * @returns {boolean} Whether the response is valid
 */
function isAlbumDataValid(data) {
  return (
    data.album
    && data.album.image
    && getThumbnailUrl(data) !== EMPTY_THUMBNAIL_LINK
  );
}

/**
 * Fetches a thumbnail for an album
 * @param {string} artist The artist on the album
 * @param {string} title The artist on the title
 * @returns {JSON} The data for the movie
 */
async function fetchThumbnailForAlbum(artist, title) {
  const artistInput = encodeURI(artist);
  const titleInput = encodeURI(title);
  const apiEndpoint = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${process.env.LAST_FM_API_KEY}&artist=${artistInput}&album=${titleInput}&format=json`;

  const response = await fetch(apiEndpoint);
  const data = await response.json();

  if (!isAlbumDataValid(data)) {
    throw new ThumbnailNotFound();
  }

  return getThumbnailUrl(data);
}

export default fetchThumbnailForAlbum;
