import fetch from 'node-fetch';

import { ListensNotFound, ThumbnailNotFound } from '../errors';

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

/**
 * Fetches my listening activity over the last week
 * @returns {JSON} Listening activity
 */
async function fetchRecentListens() {
  const apiEndpoint = buildRecentListensApiEndpoint(process.env.LAST_FM_USERNAME, process.env.LAST_FM_API_KEY, '1month');

  const response = await fetch(apiEndpoint);
  const data = await response.json();

  if (!data || !data.topalbums || !data.topalbums.album) {
    throw new ListensNotFound();
  }

  return data.topalbums.album.map((album) => {
    const thumbnails = sortThumbnailsBySize(album.image);

    return !thumbnails[0] ? null
      : {
        artist: album.artist.name,
        name: album.name,
        thumbnail: thumbnails[0]['#text'],
        plays: parseInt(album.playcount, 10),
      };
  }).filter((x) => x !== null);
}

/**
 * Builds a URL to fetch top albums with
 * @param {string} user user to fetch info for
 * @param {string} apiKey key for the lastFm API
 * @param {string} period time period to search for
 * @returns {string} The URL to call
 */
function buildRecentListensApiEndpoint(user, apiKey, period) {
  return `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json&user=${user}&api_key=${apiKey}&period=${period}`;
}

/**
 * Sorts an array of thumbnails with only a string denoting
 * size, by the intention of that string
 * @param {Array<object>} thumbnails thumbnails
 * @returns {Array<object>} thumbnails
 */
function sortThumbnailsBySize(thumbnails) {
  const getSizeValue = (x) => {
    switch (x) {
      case 'small': return 0;
      case 'medium': return 1;
      case 'large': return 2;
      case 'extralarge': return 3;
      default: return -1;
    }
  };

  const thumbnailsWithSizeValue = thumbnails.filter((x) => x['#text'] !== '').map((x) => ({ ...x, sizeVal: getSizeValue(x.size) }));

  thumbnailsWithSizeValue.sort(
    (a, b) => (a.sizeVal < b.sizeVal ? 1 : a.sizeVal === b.sizeVal ? 0 : -1),
  );

  return thumbnailsWithSizeValue;
}

export { fetchThumbnailForAlbum, fetchRecentListens };
