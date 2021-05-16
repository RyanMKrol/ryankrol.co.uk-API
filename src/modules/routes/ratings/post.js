import fs from 'fs';
import date from 'date-and-time';

const RATINGS_CREDENTIALS = JSON.parse(
  fs.readFileSync(`${__dirname}/../../../../credentials/ryankrolSite.json`),
);

/**
 * Creates the POST routes for the ratings API
 *
 * @param {object} router Express router object
 */
function createPostRouters(router) {
  createPostMiddleware(router);
  createPostRoutes(router);
}

/**
 * Creates middleware for any POST request coming to this API
 *
 * @param {object} router Express router object
 */
function createPostMiddleware(router) {
  // rating creation middleware
  router.post('/*', async (req, res, next) => {
    if (!checkCredentials(req.body.password)) {
      res.send({ message: 'Incorrect Password' });
    } else {
      // remove a password from potentially being stored
      delete req.body.password;

      // add the current date to the storage payload
      req.body.date = date.format(new Date(), 'DD-MM-YYYY');

      // handover to the specific handler
      next();
    }
  });
}

/**
 * Sets up the routes for creating individual ratings
 *
 * @param {object} router Express router object
 */
function createPostRoutes(router) {
  router.post('/movie', async (req, res, next) => {
    res.send({ message: 'Movie Write Complete!' });
    next();
  });

  router.post('/album', async (req, res, next) => {
    res.send({ message: 'Album Write Complete!' });
    next();
  });
}

/**
 * Checks that the password on a request matches the actual password
 *
 * @param {string} incomingPassword Passowrd being used to attempt ratings creation
 * @returns {boolean} Whether the password is correct
 */
function checkCredentials(incomingPassword) {
  return incomingPassword === RATINGS_CREDENTIALS.password;
}

export default createPostRouters;
