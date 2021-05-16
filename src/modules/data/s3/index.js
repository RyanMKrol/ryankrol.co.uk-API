import fs from 'fs';
import AWS from 'aws-sdk';

const credentials = JSON.parse(fs.readFileSync(`${__dirname}/../../../../credentials/aws.json`));

/**
 * Method to download file from S3 storage
 *
 * @param {string} bucket The bucket to fetch a file for
 * @param {string} file The file in the bucket we're fetching
 * @returns {JSON} Data from a file in S3
 */
async function downloadFile(bucket, file) {
  AWS.config.update(credentials);

  const params = {
    Bucket: bucket,
    Key: file,
  };

  return new Promise((resolve, reject) => {
    new AWS.S3().getObject(params, (error, data) => {
      if (error) reject(error);
      resolve(JSON.parse(data.Body.toString()));
    });
  });
}

export default downloadFile;
