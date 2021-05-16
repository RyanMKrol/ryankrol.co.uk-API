import { getWriteQueueInstance, scanTable } from '../shared/dynamo';

const ALBUM_RATINGS_TABLE = 'AlbumRatings';
const MOVIE_RATINGS_TABLE = 'MovieRatings';

/**
 * Method to write a new ratings entry to the album ratings database
 *
 * @param {object} data The data that comprises this ratings entry
 * @param {Function} callback The method to call once the write is complete
 */
async function createAlbumRatings(data, callback) {
  const writeQueue = getWriteQueueInstance(ALBUM_RATINGS_TABLE);
  writeQueue.push(data, callback);
}

/**
 * Method to write a new ratings entry to the movie ratings database
 *
 * @param {object} data The data that comprises this ratings entry
 * @param {Function} callback The method to call once the write is complete
 */
async function createMovieRatings(data, callback) {
  const writeQueue = getWriteQueueInstance(MOVIE_RATINGS_TABLE);
  writeQueue.push(data, callback);
}

/**
 * Method to fetch all album ratings
 *
 * @returns {any} Any data in the album ratings table
 */
async function getAlbumRatings() {
  return scanTable(ALBUM_RATINGS_TABLE);
}

/**
 * Method to fetch all movie ratings
 *
 * @returns {any} Any data in the movie ratings table
 */
async function getMovieRatings() {
  return scanTable(MOVIE_RATINGS_TABLE);
}

export {
  createAlbumRatings, createMovieRatings, getAlbumRatings, getMovieRatings,
};
