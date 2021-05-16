import Cache from './Cache';
import { CacheAlreadyExists, CacheDoesNotExist } from '../errors';
/**
 * A collection of caches
 */
export class CacheCollection {
  /**
   * Constructs a collection of Caches
   */
  constructor() {
    this.caches = {};
  }

  /**
   * Registers a new cache in the collection
   *
   * @param {string} name What key to create a cache against
   * @param {number} ttlMinutes The number of minutes that this cache should save data for
   * @param {Function} method The method to call to fetch new data
   * @returns {Cache} The cache created by this register
   */
  registerCache(name, ttlMinutes, method) {
    if (this.caches[name]) throw new CacheAlreadyExists();

    this.caches[name] = new Cache(method, ttlMinutes);

    return this.caches[name];
  }

  /**
   * Fetches a cache using a given name
   *
   * @param {string} name The name of the cache to find
   * @returns {Cache} the cache against the name given
   */
  getCache(name) {
    if (!this.caches[name]) {
      throw new CacheDoesNotExist();
    }

    return this.caches[name];
  }
}

const cacheCollection = new CacheCollection();
export default cacheCollection;
