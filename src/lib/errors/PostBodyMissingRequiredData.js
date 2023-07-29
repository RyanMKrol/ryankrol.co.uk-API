export default class PostBodyMissingRequiredData extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, PostBodyMissingRequiredData);

    this.name = 'PostBodyMissingRequiredData';
    this.status = 400;
  }
}
