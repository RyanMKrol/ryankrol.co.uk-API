import NodeCache from 'node-cache';

/**
 * Method to either read cache, or call method and update it
 * @param {NodeCache} cache The underlying cache
 * @param {string} key The key to interact with the cache
 * @param {Function} fn The method to fetch the data we need if the cache value is invalid
 * @returns {any} Anything we care to store in the cache
 */
function cacheReadthrough(cache, key, fn) {
  return new Promise((resolve, reject) => {
    if (cache.has(key)) {
      resolve(cache.get(key));
    } else {
      fn()
        .then((result) => {
          cache.set(key, result);
          resolve(result);
        })
        .catch(reject);
    }
  });
}

export { cacheReadthrough };
