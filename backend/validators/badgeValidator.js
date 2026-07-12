const { body, param } = require('express-validator');

const createBadgeValidator = [
  body('name').trim().notEmpty().withMessage('Badge name is required'),
  body('xpRequired').isInt({ min: 0 }).withMessage('xpRequired must be a non-negative integer'),
  body('tier').optional().isIn(['Bronze', 'Silver', 'Gold', 'Platinum']).withMessage('Invalid tier'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid badge id')];

module.exports = { createBadgeValidator, idParamValidator };
