import ceil from 'lodash.ceil';
import fill from 'lodash.fill';
import fs from 'fs';

import apiCall from '../shared/utils';

const API_CONFIG = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../credentials/googleBooks.json`),
);
const API_OVERRIDES = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../configuration/GoogleBooksAPIOverrides.json`),
);

const { userId, bookshelfId } = API_CONFIG;

const BATCH_SIZE = 40;
const API_VOLUMES_ENDPOINT = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}/volumes?maxResults=${BATCH_SIZE}`;
const API_BOOKSHELF_ENDPOINT = `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${bookshelfId}`;
const API_SEARCH_ENDPOINT = `https://www.googleapis.com/books/v1/volumes?key=${API_CONFIG.apiKey}`;

/**
 * API to fetch a book cover URL from the google books API
 *
 * @param {string} title Title of the book
 * @param {string} author Author of the book
 * @returns {object} Google Books API response
 */
async function fetchBookInfo(title, author) {
  const endpoint = `${API_SEARCH_ENDPOINT}&q=${title}+inauthor:${author}`;
  return apiCall(endpoint);
}

/**
 * Call to fetch data around book collections, and extracting relevant data
 *
 * @returns {any} A collection of books for the site to display
 */
async function getBooks() {
  const bookshelfInformation = await fetchBookshelfInformation();
  const rawBookData = await fetchRawBooksInfo(bookshelfInformation);
  const booksData = extractRelevantApiData(rawBookData);
  const books = applyDataOverrides(booksData);

  return books;
}

/**
 * Fetches the raw bookshelf info from GoogleBooks
 *
 * @returns {any} API response from GoogleBooks
 */
async function fetchBookshelfInformation() {
  return apiCall(API_BOOKSHELF_ENDPOINT);
}

/**
 * Fetches all of the raw data for books in a library
 *
 * @param {any} bookshelfInformation The raw books response from GoogleBooks
 * @returns {Array<any>} GoogleBooks API responses for each book in our collection
 */
async function fetchRawBooksInfo(bookshelfInformation) {
  const numBooks = bookshelfInformation.volumeCount;
  const links = generateApiLinks(numBooks);

  const apiResponses = await Promise.all(links.map((link) => apiCall(link)));

  return apiResponses.reduce((accumulator, response) => accumulator.concat(response.items), []);
}

/**
 * Generates the API links needed to get all of the books from a library
 *
 * @param {number} numBooks  The number of books to fetch data for
 * @returns {Array<string>} An array of links to resolve with data
 */
function generateApiLinks(numBooks) {
  const linksNeeded = ceil(numBooks / BATCH_SIZE);
  return fill(Array(linksNeeded), '').map(
    (_, index) => `${API_VOLUMES_ENDPOINT}&startIndex=${index * BATCH_SIZE}`,
  );
}

/**
 * Normalises the data from every book we've fetched
 *
 * @param {Array<any>} rawData An array of data for every book we found
 * @returns {Array<any>} Relevant books data to use on the site
 */
function extractRelevantApiData(rawData) {
  const potentiallyNullBooks = rawData.map((book) => ({
    authors: book.volumeInfo.authors,
    bookId: book.id,
    images: book.volumeInfo.imageLinks,
    isbn: getBookIsbnData(book),
    series: book.volumeInfo.title,
    numberInSeries: 1,
    title: book.volumeInfo.title,
  }));

  const books = potentiallyNullBooks.filter(
    (book) => typeof book.title !== 'undefined'
      && typeof book.authors !== 'undefined'
      && typeof book.images !== 'undefined'
      && typeof book.isbn !== 'undefined'
      && typeof book.series !== 'undefined'
      && typeof book.numberInSeries !== 'undefined'
      && typeof book.bookId !== 'undefined',
  );

  return books;
}

/**
 * Gets the ISBN number for a book
 *
 * @param {any} rawBook GoogleBooks API response for a specific book
 * @returns {string} The ISBN identifier
 */
function getBookIsbnData(rawBook) {
  const isbnData = rawBook.volumeInfo.industryIdentifiers;

  if (typeof isbnData === 'undefined') {
    return undefined;
  }

  const isbnArray = isbnData.filter((item) => item.type === 'ISBN_13');
  const isbn = isbnArray.length === 1 ? isbnArray[0].identifier : undefined;

  return isbn;
}

/**
 * Applies any local overrides we have for data we've received from the API
 *
 * @param {Array<any>} booksData Collection of normalised data for our books
 * @returns {Array<any>} The same book data above, with any overrides applied
 */
function applyDataOverrides(booksData) {
  return booksData.map((book) => ({ ...book, ...API_OVERRIDES[book.bookId] }));
}

export { fetchBookInfo, getBooks };
