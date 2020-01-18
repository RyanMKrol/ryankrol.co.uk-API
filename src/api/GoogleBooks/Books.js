import ceil from 'lodash.ceil'
import fill from 'lodash.fill'
import {
  apiCall,
  fetchConfig,
} from "./../utils"

let API_CONFIG = fetchConfig(__dirname + '/../../../credentials/googleBooksConfig.json')
let API_OVERRIDES = fetchConfig(__dirname + '/../../../configuration/GoogleBooksAPIOverrides.json')

const USER_ID = API_CONFIG.userId
const BOOKSHELF_ID = API_CONFIG.bookshelfId

const BATCH_SIZE = 40
const API_VOLUMES_ENDPOINT = `https://www.googleapis.com/books/v1/users/${USER_ID}/bookshelves/${BOOKSHELF_ID}/volumes?maxResults=${BATCH_SIZE}`
const API_BOOKSHELF_ENDPOINT = `https://www.googleapis.com/books/v1/users/${USER_ID}/bookshelves/${BOOKSHELF_ID}`

// Example Endpoint:
// https://www.googleapis.com/books/v1/users/112523674207519115434/bookshelves/2/volumes

// orchestrates the fetching of raw data, and then normalising it for external use
async function fetchBooks() {
  const bookshelfInformation = await fetchBookshelfInformation()
  const rawBookData = await _fetchRawBooksInfo(bookshelfInformation)
  const booksData = _extractRelevantApiData(rawBookData)
  const books = _applyDataOverrides(booksData)

  return books
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
      authors: book.volumeInfo.authors,
      bookId: book.id,
      images: book.volumeInfo.imageLinks,
      isbn: _getBookIsbnData(book),
      series: book.volumeInfo.title,
      numberInSeries: 1,
      title: book.volumeInfo.title,
    }
  })

  const books = potentiallyNullBooks.filter((book) => {
    return typeof book.title !== "undefined" &&
      typeof book.authors !== "undefined" &&
      typeof book.images !== "undefined" &&
      typeof book.isbn !== "undefined" &&
      typeof book.series !== "undefined" &&
      typeof book.numberInSeries !== "undefined" &&
      typeof book.bookId !== "undefined"
  })

  return books
}

// applies any local overrides we have for data we've received from the API
function _applyDataOverrides(booksData) {
  return booksData.map((book) => {
    return Object.assign({}, book, API_OVERRIDES[book.bookId])
  })
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
