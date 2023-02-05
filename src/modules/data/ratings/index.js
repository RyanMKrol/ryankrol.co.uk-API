import { getWriteQueueInstance, scanTable } from '../shared/dynamo';

const ALBUM_RATINGS_TABLE = 'AlbumRatings';
const BOOK_RATINGS_TABLE = 'BookRatings';
const MOVIE_RATINGS_TABLE = 'MovieRatings';
const TELEVISION_RATINGS_TABLE = 'TelevisionRatings';

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
 * Method to write a new ratings entry to the book ratings database
 *
 * @param {object} data The data that comprises this ratings entry
 * @param {Function} callback The method to call once the write is complete
 */
async function createBookRatings(data, callback) {
  const writeQueue = getWriteQueueInstance(BOOK_RATINGS_TABLE);
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
 * Method to write a new ratings entry to the television ratings database
 *
 * @param {object} data The data that comprises this ratings entry
 * @param {Function} callback The method to call once the write is complete
 */
async function createTelevisionRatings(data, callback) {
  const writeQueue = getWriteQueueInstance(TELEVISION_RATINGS_TABLE);
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
 * Method to fetch all book ratings
 *
 * @returns {any} Any data in the book ratings table
 */
async function getBookRatings() {
  return scanTable(BOOK_RATINGS_TABLE);
}

/**
 * Method to fetch all movie ratings
 *
 * @returns {any} Any data in the movie ratings table
 */
async function getMovieRatings() {
  return scanTable(MOVIE_RATINGS_TABLE);
}

/**
 * Method to fetch all television ratings
 *
 * @returns {any} Any data in the television ratings table
 */
async function getTelevisionRatings() {
  return scanTable(TELEVISION_RATINGS_TABLE);
}

export {
  createAlbumRatings,
  createBookRatings,
  createMovieRatings,
  createTelevisionRatings,
  getAlbumRatings,
  getBookRatings,
  getMovieRatings,
  getTelevisionRatings,
};
