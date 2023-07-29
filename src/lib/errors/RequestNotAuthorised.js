export default class RequestNotAuthorised extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, RequestNotAuthorised);

    this.name = 'RequestNotAuthorised';
    this.status = 401;
  }
}
