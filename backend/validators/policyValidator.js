const { body, param } = require('express-validator');

const createPolicyValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('category')
    .optional()
    .isIn(['Environmental', 'Social', 'Governance', 'Compliance', 'General'])
    .withMessage('Invalid category'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid policy id')];

module.exports = { createPolicyValidator, idParamValidator };
