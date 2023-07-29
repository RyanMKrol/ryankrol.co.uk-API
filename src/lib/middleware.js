import date from 'date-and-time';
import {
  RequestNotAuthorised,
  PostBodyMissingRequiredData,
} from './errors';

/**
   * A method to run a series of methods to handle a request, which can include
   * middleware. Each method must either throw an error, or return data to be
   * sent in the response
   * @param {Request} req request
   * @param {Response} res response
   * @param {...Function} handlerMethods methods to run
   * @returns {Function} final method to call with the request and response objects
   */
async function handlerWithOptionalMiddleware(req, res, ...handlerMethods) {
  return handlerMethods
    .reduce(async (acc, handlerFn) => acc
      .then(() => handlerFn(req, res))
      .catch((err) => {
        throw err;
      }), Promise.resolve())
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      if (err.status && err.name) {
        res.status(err.status).json({ message: err.name });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    });
}

/**
   * Middleware to stop unauthorised requests from going through
   * @param {Request} req request
   */
function withAuthentication(req) {
  if (req.body.password !== process.env.RYANKROL_SITE_KEY) {
    throw new RequestNotAuthorised();
  }
  delete req.body.password;
}

/**
   * Middleware to add a date to the request body
   * @param {Request} req request
   */
function withDateTracking(req) {
  req.body.date = date.format(new Date(), 'DD-MM-YYYY');
}

/**
   * Middleware to alter the request body dynamically. Typical use for this would be to
   * modify the body in the middleware layer, and then enforce checks on the body via
   * withRequiredBodyKeys. This method makes it easier to maintain a chain of methods
   * @param {Function} fn The method you want to alter the request body with
   * @returns {Function} A middleware function
   */
function withRequestBodyModification(fn) {
  return (req) => fn(req);
}

/**
   * Middleware to enforce request structure for our POST requests
   * @param {Array<string>} keys The keys you want to be present in the request body
   * @returns {Function} A middleware function
   */
function withRequiredBodyKeys(keys) {
  return (req) => {
    if (
      !keys.reduce(
        (acc, key) => acc && Object.keys(req.body).includes(key),
        true,
      )
    ) {
      throw new PostBodyMissingRequiredData();
    }
  };
}

export {
  handlerWithOptionalMiddleware,
  withAuthentication,
  withDateTracking,
  withRequestBodyModification,
  withRequiredBodyKeys,
};
