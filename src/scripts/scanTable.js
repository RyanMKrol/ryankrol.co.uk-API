import { scanTable } from '../lib/dynamo';
import { DYNAMO_TABLES } from '../lib/constants';

/**
 * Main
 */
async function main() {
  const TARGET_TABLE = DYNAMO_TABLES.ALBUM_RATINGS_TABLE;

  const data = await scanTable(TARGET_TABLE);

  data.forEach((item) => {
    process.stdout.write(`${JSON.stringify(item, null, 2)}\n`);
  });
}

main();
