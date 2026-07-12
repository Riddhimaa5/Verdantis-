const { body, param } = require('express-validator');

const createRewardValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('pointsCost').isInt({ min: 0 }).withMessage('pointsCost must be a non-negative integer'),
  body('stock').isInt({ min: 0 }).withMessage('stock must be a non-negative integer'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid reward id')];

module.exports = { createRewardValidator, idParamValidator };
