export default class ListensNotFound extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, ListensNotFound);

    this.name = 'ListensNotFound';
    this.status = 500;
  }
}
