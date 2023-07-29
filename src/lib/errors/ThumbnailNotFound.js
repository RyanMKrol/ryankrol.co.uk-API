export default class ThumbnailNotFound extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, ThumbnailNotFound);

    this.name = 'ThumbnailNotFound';
    this.status = 500;
  }
}
