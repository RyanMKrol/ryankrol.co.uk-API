import { scanTable } from '../lib/dynamo';
import { DYNAMO_TABLES } from '../lib/constants';

/**
 * Script to scan and print the contents of a Dynamo table
 */
async function main() {
  const SOURCE_TABLE_NAME = DYNAMO_TABLES.ALBUM_RATINGS_TABLE;

  const data = await scanTable(SOURCE_TABLE_NAME);

  data.forEach((item) => {
    process.stdout.write(`${JSON.stringify(item, null, 2)}\n`);
  });
}

main();
