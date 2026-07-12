const ApiError = require('../utils/ApiError');

/**
 * Restricts route access to specific roles.
 * Usage: authorize('Admin', 'Manager')
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Not authorized, please log in');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Role '${req.user.role}' is not permitted to perform this action`
      );
    }

    next();
  };
};

module.exports = { authorize };
