const { body, param } = require('express-validator');

const createAuditValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('auditType')
    .optional()
    .isIn(['Environmental', 'Social', 'Governance', 'Financial', 'General'])
    .withMessage('Invalid audit type'),
  body('department').optional().isMongoId().withMessage('Invalid department id'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid audit id')];

module.exports = { createAuditValidator, idParamValidator };
