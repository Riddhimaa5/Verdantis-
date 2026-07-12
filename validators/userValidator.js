const { body, param } = require('express-validator');

const idParamValidator = [param('id').isMongoId().withMessage('Invalid user id')];

const updateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email'),
  body('role').optional().isIn(['Admin', 'Manager', 'Employee']).withMessage('Invalid role'),
  body('department').optional().isMongoId().withMessage('Invalid department id'),
  body('isActive').optional().isBoolean().withMessage('isActive must be boolean'),
];

module.exports = { idParamValidator, updateUserValidator };
