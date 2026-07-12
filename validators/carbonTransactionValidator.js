const { body, param } = require('express-validator');

const createCarbonTransactionValidator = [
  body('department').isMongoId().withMessage('Valid department id is required'),
  body('emissionFactor').isMongoId().withMessage('Valid emission factor id is required'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  body('transactionDate').optional().isISO8601().withMessage('Invalid date'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid carbon transaction id')];

module.exports = { createCarbonTransactionValidator, idParamValidator };
