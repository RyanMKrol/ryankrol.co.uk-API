import ceil from 'lodash.ceil'
import fill from 'lodash.fill'
import fs from 'fs'
import { apiCall } from "./../utils"

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/googleBooksConfig.json')
let config = JSON.parse(rawdata)

const userId = config.userId
const bookshelfId = config.bookshelfId

const BATCH_SIZE = 40
const API_VOLUMES_ENDPOINT = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}/volumes?maxResults=${BATCH_SIZE}`
const API_BOOKSHELF_ENDPOINT = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}`

// orchestrates the fetching of raw data, and then normalising it for external use
async function fetchBooks() {
  const bookshelfInformation = await fetchBookshelfInformation()
  const rawBookData = await fetchRawBooksInfo(bookshelfInformation)
  const resultData = extractRelevantApiData(rawBookData)

  return resultData
}

async function fetchRawBooksInfo(bookshelfInformation) {
  const numBooks = bookshelfInformation.volumeCount
  const links = generateApiLinks(numBooks)

  const apiResponses = await Promise.all(links.map((link) => {
    return apiCall(link)
  }))

  return apiResponses.reduce(
    (accumulator, response) => accumulator.concat(response.items),
    []
  )
}

function generateApiLinks(numBooks) {
  const linksNeeded = ceil(numBooks/BATCH_SIZE)
  return fill(Array(linksNeeded), '')
    .map((_, index) => `${API_VOLUMES_ENDPOINT}&startIndex=${index*BATCH_SIZE}`)
}

async function fetchBookshelfInformation() {
  return await apiCall(API_BOOKSHELF_ENDPOINT)
}

// normalises the data from the GoogleBooks API
function extractRelevantApiData(rawData) {
  return rawData
}

export default fetchBooks
