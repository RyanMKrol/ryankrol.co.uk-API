import moment from 'moment';
import { downloadFile, uploadFile } from '../shared/s3';

const CACHE_BUCKET_NAME = 'ryankrol-api-cache';

/**
 * A cache for an individual data fetch
 */
class Cache {
  /**
   * @param {string} name The name of the cache
   * @param {Function} method The method to fetch new data
   * @param {number} ttlMinutes How long the cache should live for
   */
  constructor(name, method, ttlMinutes) {
    /**
     * Ensuring any method being used returns a promise
     *
     * @returns {Promise<any>} A promise containing the value returned by the method
     */
    this.method = async () => new Promise((resolve, reject) => {
      try {
        resolve(method());
      } catch (e) {
        reject(e);
      }
    });

    this.ttlMinutes = ttlMinutes;
    this.name = name;
    this.ttl = null;
    this.data = null;
  }

  /**
   * Initialise the cache with persistant long term storage values in S3
   *
   * @returns {Cache} The initialised cache instance
   */
  async initialise() {
    return downloadFile(CACHE_BUCKET_NAME, fetchTodaysCacheId(this.name))
      .then((data) => {
        this.data = data;
        this.ttl = generateNewTtl(this.ttlMinutes);
      })
      .then(() => this)
      .catch(() => this);
  }

  /**
   * Call the method associated with fetching our data
   *
   * @returns {any} The data fetched by the cache method
   */
  async call() {
    const currentTime = new Date();

    if (this.ttl < currentTime) {
      return this.method()
        .then((data) => {
          // fetch the data from the underlying API
          this.data = data;
          this.ttl = generateNewTtl(this.ttlMinutes);
        })
        .then(() => {
          // store the result in S3 for long term storage
          uploadFile(CACHE_BUCKET_NAME, fetchTodaysCacheId(this.name), this.data);

          return this.data;
        })
        .catch((error) => {
          this.data = null;
          throw error;
        });
    }

    return this.data;
  }
}

/**
 * Generates a new TTL to save data against
 *
 * @param {number} minutes The number of minutes to save the data for
 * @returns {Date} A date representing when the data expires
 */
function generateNewTtl(minutes) {
  const ttlDateObject = new Date();
  ttlDateObject.setMinutes(ttlDateObject.getMinutes() + minutes);

  return ttlDateObject;
}

/**
 * Create a key to use for read/writes of cache data
 *
 * @param {string} name The name of the cache to generate a filename for
 * @returns {string} The key to use in the database
 */
function fetchTodaysCacheId(name) {
  const todayDate = moment().format('DD-MM-YYYY');
  return `${name}-${todayDate}`;
}

/**
 * Method to create and initialise a Cache object
 *
 * @param {string} name The name of the cache
 * @param {Function} method The method to fetch new data
 * @param {number} ttlMinutes How long the cache should live for
 * @returns {Cache} A new cache object
 */
async function getCacheInstance(name, method, ttlMinutes) {
  return new Cache(name, method, ttlMinutes).initialise();
}

export default getCacheInstance;
