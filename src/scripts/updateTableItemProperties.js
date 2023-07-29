import { getWriteQueueInstance, scanTable } from '../lib/dynamo';
import { DYNAMO_TABLES } from '../lib/constants';

/**
 * Method to modify the item in the table
 * @param {object} oldItem the old item
 * @returns {object} the mutated item
 */
function generateNewItem(oldItem) {
  const newItem = oldItem;

  return newItem;
}

/**
 * Script to update the items of a given table.
 *
 * Note: The script is intended to be run on an ad-hoc basis; given this, the
 * generateNewItem method is intended to be udpated with whatever logic is needed
 * to update the items in the table
 */
async function main() {
  const TABLE_NAME = DYNAMO_TABLES.ALBUM_RATINGS_TABLE;

  const originalItems = await scanTable(TABLE_NAME);

  const newItems = originalItems.map((item) => generateNewItem(item));

  const writeQueue = getWriteQueueInstance(TABLE_NAME);

  let itemsProcessedSoFar = 0;

  await new Promise((resolve) => {
    newItems.forEach((item) => {
      writeQueue.push(item, () => {
        itemsProcessedSoFar += 1;

        process.stdout.write(`Processed ${itemsProcessedSoFar} items so far...\n`);
        process.stdout.write(`Have written item: ${JSON.stringify(item, null, 2)}\n`);

        if (itemsProcessedSoFar === originalItems.length) {
          process.stdout.write('Done\n');
          resolve();
        }
      });
    });
  });

  process.exit(0);
}

main();
