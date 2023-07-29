import { getWriteQueueInstance, scanTable } from '../lib/dynamo';
import { DYNAMO_TABLES } from '../lib/constants';

/**
 * Script to backup the contents of one table into another
 *
 * Note: The table that you're migrating to must exist BEFORE you run this script. This
 * script assumes that the table will be called X-Backup, where X is the source table name
 */
async function main() {
  const SOURCE_TABLE_NAME = DYNAMO_TABLES.ALBUM_RATINGS_TABLE;
  const BACKUP_TABLE_NAME = `${SOURCE_TABLE_NAME}-Backup`;

  const items = await scanTable(SOURCE_TABLE_NAME);

  const writeQueue = getWriteQueueInstance(BACKUP_TABLE_NAME);

  let itemsSoFar = 0;

  await new Promise((resolve) => {
    writeQueue.pushBatch(items, () => {
      itemsSoFar += 1;
      if (itemsSoFar === items.length) {
        resolve();
      }
      process.stdout.write(`Processed ${itemsSoFar} items so far...\n`);
    });
  });

  process.exit(0);
}

main();
