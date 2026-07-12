const { body, param } = require('express-validator');

const createCSRActivityValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('activityDate').isISO8601().withMessage('Valid activity date is required'),
  body('department').optional().isMongoId().withMessage('Invalid department id'),
  body('beneficiaryCount').optional().isInt({ min: 0 }),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid CSR activity id')];

module.exports = { createCSRActivityValidator, idParamValidator };
