const { body, param } = require('express-validator');

const createComplianceIssueValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('severity').optional().isIn(['Low', 'Medium', 'High', 'Critical']).withMessage('Invalid severity'),
  body('department').optional().isMongoId().withMessage('Invalid department id'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid compliance issue id')];

module.exports = { createComplianceIssueValidator, idParamValidator };
