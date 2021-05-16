import downloadFile from '../shared/s3';

const MOVIE_BUCKET_NAME = 'ryankrol-films';
const MOVIE_DATA_FILE_KEY = 'films_data.txt';

/**
 * Method to fetch all movies
 *
 * @returns {JSON} JSON representing all movies I own
 */
async function getMovies() {
  return downloadFile(MOVIE_BUCKET_NAME, MOVIE_DATA_FILE_KEY);
}

export default getMovies;
