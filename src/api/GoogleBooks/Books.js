import fs from 'fs'
import {
  apiCall
} from "./../utils"

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/googleBooksConfig.json')
let config = JSON.parse(rawdata)

const username = config.userId
const apiKey = config.bookshelfId

const API_ENDPOINT = `https://www.googleapis.com/books/v1/users/${username}/bookshelves/${apiKey}/volumes?maxResults=40`

// orchestrates the fetching of raw data, and then normalising it for external use
async function fetchBooks() {
  const rawBookData = await apiCall(API_ENDPOINT)
  const resultData = extractRelevantApiData(rawBookData)

  return resultData
}

// normalises the data from the GoogleBooks API
function extractRelevantApiData(rawData) {
  return rawData
}

export default fetchBooks
