const { body, param } = require('express-validator');

const createDepartmentValidator = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
  body('manager').optional().isMongoId().withMessage('Invalid manager id'),
];

const updateDepartmentValidator = [
  param('id').isMongoId().withMessage('Invalid department id'),
  body('name').optional().trim().notEmpty(),
  body('code').optional().trim().notEmpty(),
  body('manager').optional().isMongoId().withMessage('Invalid manager id'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid department id')];

module.exports = { createDepartmentValidator, updateDepartmentValidator, idParamValidator };
