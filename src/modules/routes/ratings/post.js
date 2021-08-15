import createError from 'http-errors';
import date from 'date-and-time';
import fs from 'fs';

import {
  createAlbumRatings,
  createMovieRatings,
  createTelevisionRatings,
} from '../../data/ratings';
import {
  fetchThumbnailForMovie,
  fetchThumbnailForAlbum,
  fetchThumbnailForTelevision,
} from '../../data/thumbnails';

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
  router.post('/*', async (req, res, next) => {
    if (!checkCredentials(req.body.password)) {
      res.send({ message: 'Incorrect Password' });
    } else {
      delete req.body.password;

      req.body.date = date.format(new Date(), 'DD-MM-YYYY');

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
  createAlbumPostRoutes(router);
  createMoviePostRoutes(router);
  createTelevisionPostRoutes(router);
}

/**
 * Sets up the routes for creating album ratings
 *
 * @param {object} router Express router object
 */
function createAlbumPostRoutes(router) {
  router.post('/album', async (req, res, next) => {
    try {
      req.body.thumbnail = await fetchThumbnailForAlbum(req.body.artist, req.body.title);
      next();
    } catch (e) {
      res.send({ message: 'Could not find album thumbnail' });
    }
  });

  router.post('/album', async (req, res, next) => {
    /**
     * Method to let the user know that the write is complete
     */
    const callback = () => {
      res.send({ message: 'Album Write Complete!' });
    };

    try {
      createAlbumRatings(req.body, callback);
    } catch (e) {
      next(createError(500));
    }
  });
}

/**
 * Sets up the routes for creating movie ratings
 *
 * @param {object} router Express router object
 */
function createMoviePostRoutes(router) {
  router.post('/movie', async (req, res, next) => {
    try {
      req.body.thumbnail = await fetchThumbnailForMovie(req.body.title);
      next();
    } catch (e) {
      res.send({ message: 'Could not find movie thumbnail' });
    }
  });

  router.post('/movie', async (req, res, next) => {
    /**
     * Method to let the user know that the write is complete
     */
    const callback = () => {
      res.send({ message: 'Movie Write Complete!' });
    };

    try {
      createMovieRatings(req.body, callback);
    } catch (e) {
      next(createError(500));
    }
  });
}

/**
 * Sets up the routes for creating television ratings
 *
 * @param {object} router Express router object
 */
function createTelevisionPostRoutes(router) {
  router.post('/tv', async (req, res, next) => {
    try {
      req.body.thumbnail = await fetchThumbnailForTelevision(req.body.title);
      next();
    } catch (e) {
      res.send({ message: 'Could not find TV thumbnail' });
    }
  });

  router.post('/tv', async (req, res, next) => {
    /**
     * Method to let the user know that the write is complete
     */
    const callback = () => {
      res.send({ message: 'TV Write Complete!' });
    };

    try {
      createTelevisionRatings(req.body, callback);
    } catch (e) {
      next(createError(500));
    }
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
