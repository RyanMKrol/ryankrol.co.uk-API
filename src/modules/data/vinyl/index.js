import { getWriteQueueInstance, scanTable } from '../shared/dynamo';

const VINYL_COLLECTION_TABLE = 'VinylCollection';

/**
 * Method to write a new vinyl entry to the vinyl collection database
 *
 * @param {object} data The data that comprises this vinyl record
 * @param {Function} callback The method to call once the write is complete
 */
async function createVinylItem(data, callback) {
  const writeQueue = getWriteQueueInstance(VINYL_COLLECTION_TABLE);
  writeQueue.push(data, callback);
}

/**
 * Method to fetch all vinyl items
 *
 * @returns {any} Any data in the vinyl collection table
 */
async function getVinylCollection() {
  return scanTable(VINYL_COLLECTION_TABLE);
}

export {
  createVinylItem,
  getVinylCollection,
};
