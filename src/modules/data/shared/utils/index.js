import fetch from 'node-fetch';

/**
 * Method for calling APIs and parsing the response to JSON
 *
 * @param {string} url The URL to fetch the data from
 * @returns {JSON} Data from the API in JSON format
 */
async function jsonApiCall(url) {
  return fetch(url)
    .then((res) => res.json())
    .catch((error) => {
      throw error;
    });
}

export default jsonApiCall;
