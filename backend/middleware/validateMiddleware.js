const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after express-validator's chain of checks on a route.
 * Collects any validation errors and forwards a formatted 400 error.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((e) => ({ field: e.path, message: e.msg }));
    return next(new ApiError(400, 'Validation failed', formatted));
  }
  next();
};

module.exports = validate;
