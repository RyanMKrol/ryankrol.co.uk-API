export class Cache {
  constructor(fetchMethod, ttlMinutes) {
    this.fetchMethod = fetchMethod;
    this.ttlMinutes = ttlMinutes;
    this.cacheData = {};
  }

  async fetchData(args = "") {
    const cacheKey = args.toString();
    const currentTime = new Date();

    if (!this.cacheData[cacheKey]) {
      this.cacheData[cacheKey] = {
        data: await this.fetchMethod(args),
        ttl: this.generateNewTtl()
      };
    }

    if (this.cacheData[cacheKey].ttl < currentTime) {
      this.cacheData[cacheKey] = {
        data: await this.fetchMethod(args),
        ttl: this.generateNewTtl()
      };
    }

    return this.cacheData[cacheKey].data;
  }

  generateNewTtl() {
    const ttlDateObject = new Date();
    ttlDateObject.setMinutes(ttlDateObject.getMinutes() + this.ttlMinutes);

    return ttlDateObject;
  }
}
