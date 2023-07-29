import { DynamoWriteQueue, DynamoScan } from 'noodle-utils';

import 'dotenv/config';

const CREDENTIALS = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const DYNAMO_REGION = 'us-east-2';
const WRITE_QUEUES = {};

/**
 * Method to fetch a write queue to push data to a database
 * @param {string} table The table we want a write queue for
 * @returns {DynamoWriteQueue} A queue to write data to the database with
 */
function getWriteQueueInstance(table) {
  if (!WRITE_QUEUES[table]) {
    WRITE_QUEUES[table] = new DynamoWriteQueue(
      CREDENTIALS,
      DYNAMO_REGION,
      table,
    );
  }

  return WRITE_QUEUES[table];
}

/**
 * Method to scan a table in Dynamo
 * @param {string} table The table to scan data from
 * @returns {any} Data from the table
 */
async function scanTable(table) {
  const scanOperator = new DynamoScan(CREDENTIALS, DYNAMO_REGION);

  const data = await scanOperator.scanTable(table);

  return data.Items;
}

export { getWriteQueueInstance, scanTable };
