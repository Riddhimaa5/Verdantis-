const { body, param } = require('express-validator');

const createChallengeValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('xpReward').isInt({ min: 0 }).withMessage('XP reward must be a non-negative integer'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid challenge id')];

module.exports = { createChallengeValidator, idParamValidator };
