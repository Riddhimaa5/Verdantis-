const { body, param } = require('express-validator');

const createAcknowledgementValidator = [
  body('policy').isMongoId().withMessage('Valid policy id is required'),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid acknowledgement id')];

module.exports = { createAcknowledgementValidator, idParamValidator };
