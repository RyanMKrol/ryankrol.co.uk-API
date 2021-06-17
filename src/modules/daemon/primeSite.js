import fetch from 'node-fetch';
import {
  RATINGS_ENDPOINT,
  LISTENS_ENDPOINT,
  BOOKS_ENDPOINT,
  MOVIES_ENDPOINT,
  PORTFOLIO_ENDPOINT,
  LISTENING_PORT,
} from '../constants';

/**
 * Method to hit the site and ensure the caches are warmed up
 */
async function primeSite() {
  const albumRatingsUrl = buildPrimingEndpoint(`${RATINGS_ENDPOINT}/album`);
  const movieRatingsUrl = buildPrimingEndpoint(`${RATINGS_ENDPOINT}/movie`);
  const listensUrl = buildPrimingEndpoint(`${LISTENS_ENDPOINT}`);
  const booksUrl = buildPrimingEndpoint(`${BOOKS_ENDPOINT}`);
  const moviesUrl = buildPrimingEndpoint(`${MOVIES_ENDPOINT}`);
  const portfolioUrl = buildPrimingEndpoint(`${PORTFOLIO_ENDPOINT}`);

  primeEndpoint(albumRatingsUrl);
  primeEndpoint(movieRatingsUrl);
  primeEndpoint(listensUrl);
  primeEndpoint(booksUrl);
  primeEndpoint(moviesUrl);
  primeEndpoint(portfolioUrl);
}

/**
 * Builds an endopoint to prime the site with
 *
 * @param {string} endpoint Build the final endpoint using the API ingress points
 * @returns {string} The HTTP to prime the site with
 */
function buildPrimingEndpoint(endpoint) {
  return `http://localhost:${LISTENING_PORT}${endpoint}`;
}

/**
 * Makes an HTTP call to the site using the provided endpoint
 *
 * @param {string} endpoint The HTTP to prime the site with
 * @returns {Promise<any>} A promise that contains the work to prime the site
 */
async function primeEndpoint(endpoint) {
  return fetch(endpoint).then(() => {
    process.stdout.write(`Finished priming site - ${endpoint}\n`);
  });
}

export default primeSite;
