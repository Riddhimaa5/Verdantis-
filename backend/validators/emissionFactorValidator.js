const { body, param } = require('express-validator');

const createEmissionFactorValidator = [
  body('activityType').trim().notEmpty().withMessage('Activity type is required'),
  body('unit').trim().notEmpty().withMessage('Unit is required'),
  body('factorValue').isFloat({ min: 0 }).withMessage('Factor value must be a positive number'),
  body('scope').optional().isIn(['Scope 1', 'Scope 2', 'Scope 3']).withMessage('Invalid scope'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid emission factor id')];

module.exports = { createEmissionFactorValidator, idParamValidator };
