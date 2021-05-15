import createError from "http-errors";

import { DynamoWriteQueue, DynamoScan } from "noodle-utils";
import fs from "fs";

let rawdata = fs.readFileSync(
  __dirname + "/../../../credentials/awsCredentials.json"
);
let dynamoCredentials = JSON.parse(rawdata);

const DYNAMO_REGION = "us-east-2";
const WRITE_QUEUES = {};
let SCAN_OPERATOR = null;

async function writeTable(table, data, callback) {
  setupWriteQueue(table);
  WRITE_QUEUES[table].push(data, callback);
}

function setupWriteQueue(table) {
  if (!WRITE_QUEUES[table]) {
    WRITE_QUEUES[table] = new DynamoWriteQueue(
      dynamoCredentials,
      DYNAMO_REGION,
      table
    );
  }
}

async function scanTable(table, callback) {
  const scanOperator = setupScan();

  try {
    const data = await scanOperator.scanTable(table);
    callback(data.Items);
  } catch (e) {
    throw createError(500);
  }
}

function setupScan() {
  if (!SCAN_OPERATOR) {
    SCAN_OPERATOR = new DynamoScan(dynamoCredentials, DYNAMO_REGION);
  }
  return SCAN_OPERATOR;
}

export { writeTable, scanTable };
