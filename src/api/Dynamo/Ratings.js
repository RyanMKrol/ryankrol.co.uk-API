import { sleep, DynamoWriteQueue } from 'noodle-utils'
import fs from 'fs'

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/awsCredentials.json')
let dynamoCredentials = JSON.parse(rawdata)

const DYNAMO_REGION = 'us-east-2'
const WRITE_QUEUES = {}

async function writeTable(table, data, callback) {
  setupWriteQueue(table)
  WRITE_QUEUES[table].push(data, callback)
}

function setupWriteQueue(table) {
  if (!WRITE_QUEUES[table]) {
    WRITE_QUEUES[table] = new DynamoWriteQueue(dynamoCredentials, DYNAMO_REGION, table)
  }
}

export default writeTable
