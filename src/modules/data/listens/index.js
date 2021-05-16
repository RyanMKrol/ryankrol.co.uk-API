import fs from 'fs';
import apiCall from '../shared/utils';

const config = JSON.parse(fs.readFileSync(`${__dirname}/../../../../credentials/lastfm.json`));

const { username, apiKey } = config;
const API_ENDPOINT = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json&period=overall&user=${username}&api_key=${apiKey}`;

/**
 * Call to fetch data around album listens, and extract relevant data
 *
 * @returns {any} The response from the LastFM API, formatted
 */
async function getAlbumListens() {
  const rawAlbumData = await apiCall(API_ENDPOINT);
  const resultData = extractRelevantApiData(rawAlbumData);

  return resultData;
}

/**
 * Formats the data from LastFM in a way that surfaces useful information to the site
 *
 * @param {any} rawData The data from the LastFM API
 * @returns {any} The data that we actually want from the LastFM API
 */
function extractRelevantApiData(rawData) {
  const albums = rawData.topalbums.album;
  const relevantdata = albums
    .map((album) => {
      const artist = album.artist.name;
      const albumName = album.name;
      const albumLink = album.url;
      const thumbnail = album.image[album.image.length - 1]['#text'];
      const { playcount } = album;

      return artist && albumName && thumbnail
        ? {
          artist,
          albumName,
          albumLink,
          thumbnail,
          playcount,
        }
        : undefined;
    })
    .filter((x) => typeof x !== 'undefined');

  return relevantdata;
}

export default getAlbumListens;
