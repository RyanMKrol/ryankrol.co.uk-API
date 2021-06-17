/**
 * Used whenever portfolio data can't be fetched from Github
 */
class PortfolioDataNotFound extends Error {
  /**
   * @param {...any} params Anything you want passing to the Error constructor
   */
  constructor(...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PortfolioDataNotFound);
    }

    this.Error = 'PortfolioDataNotFound';
    this.StatusCode = 500;
  }
}

export default PortfolioDataNotFound;
