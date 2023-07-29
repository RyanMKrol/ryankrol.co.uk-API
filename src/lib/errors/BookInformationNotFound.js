export default class BookInformationNotFound extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, BookInformationNotFound);

    this.name = 'BookInformationNotFound';
    this.status = 404;
  }
}
