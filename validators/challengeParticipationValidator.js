const { body, param } = require('express-validator');

const createChallengeParticipationValidator = [
  body('challenge').isMongoId().withMessage('Valid challenge id is required'),
  body('employee').optional().isMongoId().withMessage('Invalid employee id'),
];

const updateProgressValidator = [
  param('id').isMongoId().withMessage('Invalid participation id'),
  body('progress').optional().isInt({ min: 0, max: 100 }).withMessage('Progress must be 0-100'),
  body('status')
    .optional()
    .isIn(['Registered', 'In Progress', 'Completed', 'Dropped'])
    .withMessage('Invalid status'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid participation id')];

module.exports = { createChallengeParticipationValidator, updateProgressValidator, idParamValidator };
