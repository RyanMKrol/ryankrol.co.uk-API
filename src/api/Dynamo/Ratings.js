import { sleep, DynamoWriteQueue } from 'noodle-utils'
import fs from 'fs'

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/awsCredentials.json')
let dynamoCredentials = JSON.parse(rawdata)

const DYNAMO_REGION = 'us-east-2'
const DYNAMO_TABLE = 'MovieRatings'
const writeQueue = new DynamoWriteQueue(dynamoCredentials, DYNAMO_REGION, DYNAMO_TABLE)

async function writeTable(data, callback) {
  writeQueue.push(data, callback)
}

export default writeTable
