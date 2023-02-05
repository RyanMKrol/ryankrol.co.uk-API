import { fetchBookInfo } from '../books';

/**
 * Fetch remote info for a given book
 *
 * @param {string} title Title of the book
 * @param {string} author Author of the book
 * @returns {object} Information about a book to be forwarded to the ratings API
 */
async function fetchRemoteInfoForBook(title, author) {
  const data = await fetchBookInfo(title, author);

  if (!data.items || data.items.length === 0) {
    throw new Error('no book here');
  }

  const targetBookInfo = data.items[0];

  const { thumbnail } = targetBookInfo.volumeInfo.imageLinks;
  const { infoLink, publishedDate } = targetBookInfo.volumeInfo;

  if (!thumbnail || !infoLink || !publishedDate) {
    throw new Error('Missing Book Info');
  }

  return {
    thumbnail,
    infoLink,
    publishedDate,
  };
}

export default fetchRemoteInfoForBook;
