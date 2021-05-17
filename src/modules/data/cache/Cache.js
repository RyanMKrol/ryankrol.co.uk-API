/**
 * A cache for an individual data fetch
 */
class Cache {
  /**
   * @param {Function} method The method to fetch new data
   * @param {number} ttlMinutes How long the cache should live for
   */
  constructor(method, ttlMinutes) {
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
    this.ttl = null;
    this.data = null;
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
          this.data = data;
          this.ttl = generateNewTtl(this.ttlMinutes);

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

export default Cache;
