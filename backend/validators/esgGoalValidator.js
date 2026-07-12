const { body, param } = require('express-validator');

const createESGGoalValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category').isIn(['Environmental', 'Social', 'Governance']).withMessage('Invalid category'),
  body('targetValue').isFloat().withMessage('Target value must be a number'),
  body('deadline').isISO8601().withMessage('Deadline must be a valid date'),
  body('department').optional().isMongoId().withMessage('Invalid department id'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid ESG goal id')];

module.exports = { createESGGoalValidator, idParamValidator };
