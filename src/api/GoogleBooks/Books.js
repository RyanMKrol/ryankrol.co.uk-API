import fetch from "node-fetch"
import fs from 'fs'

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/googleBooksConfig.json')
let config = JSON.parse(rawdata)

const username = config.userId
const apiKey = config.bookshelfId

const API_ENDPOINT = `https://www.googleapis.com/books/v1/users/${username}/bookshelves/${apiKey}/volumes?maxResults=40`

// orchestrates the fetching of raw data, and then normalising it for external use
async function fetchBooks() {
  const rawBookData = await apiCall()
  const resultData = extractRelevantApiData(rawBookData)

  return resultData
}

// normalises the data from the GoogleBooks API
function extractRelevantApiData(rawData) {
  return rawData
}

// fetches data from the GoogleBooks API
async function apiCall() {
  return fetch(API_ENDPOINT)
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.error(err)
    })
}

export default fetchBooks
