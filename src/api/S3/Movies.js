import fs from 'fs'
import AWS from 'aws-sdk'

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/S3Credentials.json')
let s3credentials = JSON.parse(rawdata)

const MOVIE_BUCKET_NAME = 'ryankrol-films'
const MOVIE_DATA_FILE_KEY = 'films_data.txt'

const downloadMovieData = () => {
  AWS.config.update(s3credentials)

  const params = {
    Bucket: MOVIE_BUCKET_NAME,
    Key: MOVIE_DATA_FILE_KEY
  }

  return new Promise((resolve, reject) => {
    new AWS.S3().getObject(params, (error, data) => {
      if (error) reject(error)
      console.log(JSON.parse(data.Body.toString()))
      resolve(JSON.parse(data.Body.toString()))
    })
  })
}

export default downloadMovieData
