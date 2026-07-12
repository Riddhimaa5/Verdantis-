/**
 * Custom Error class for predictable, operational API errors.
 * Allows controllers/services to throw errors with an HTTP status code attached.
 */
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
