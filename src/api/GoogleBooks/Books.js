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

// Example Endpoint:
// https://www.googleapis.com/books/v1/users/112523674207519115434/bookshelves/2/volumes

// orchestrates the fetching of raw data, and then normalising it for external use
async function fetchBooks() {
  const bookshelfInformation = await fetchBookshelfInformation()
  const rawBookData = await _fetchRawBooksInfo(bookshelfInformation)
  const resultData = _extractRelevantApiData(rawBookData)

  return resultData
}

// fetches all of the raw data for a books library
async function _fetchRawBooksInfo(bookshelfInformation) {
  const numBooks = bookshelfInformation.volumeCount
  const links = _generateApiLinks(numBooks)

  const apiResponses = await Promise.all(links.map((link) => {
    return apiCall(link)
  }))

  return apiResponses.reduce(
    (accumulator, response) => accumulator.concat(response.items),
    []
  )
}

// generates the API links needed to get all of the books from a library
function _generateApiLinks(numBooks) {
  const linksNeeded = ceil(numBooks/BATCH_SIZE)
  return fill(Array(linksNeeded), '')
    .map((_, index) => `${API_VOLUMES_ENDPOINT}&startIndex=${index*BATCH_SIZE}`)
}

async function fetchBookshelfInformation() {
  return await apiCall(API_BOOKSHELF_ENDPOINT)
}

// normalises the data from the GoogleBooks API
function _extractRelevantApiData(rawData) {
  const potentiallyNullBooks = rawData.map((book) => {
    return {
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      images: book.volumeInfo.imageLinks,
      isbn: _getBookIsbnData(book),
      bookId: book.id,
    }
  })

  const books = potentiallyNullBooks.filter((book) => {
    return typeof book.title !== "undefined" &&
      typeof book.authors !== "undefined" &&
      typeof book.images !== "undefined" &&
      typeof book.isbn !== "undefined" &&
      typeof book.bookId !== "undefined"
  })

  return books
}

function _getBookIsbnData(rawBook) {
  const isbnData = rawBook.volumeInfo.industryIdentifiers

  if (typeof isbnData === 'undefined') {
    return undefined
  }

  const isbnArray = isbnData.filter((item) => item.type==="ISBN_13")
  const isbn = isbnArray.length === 1 ? isbnArray[0].identifier : undefined

  return isbn
}

export default fetchBooks
