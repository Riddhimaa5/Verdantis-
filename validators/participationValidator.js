const { body, param } = require('express-validator');

const createParticipationValidator = [
  body('csrActivity').isMongoId().withMessage('Valid CSR activity id is required'),
  body('employee').optional().isMongoId().withMessage('Invalid employee id'),
  body('hoursContributed').optional().isFloat({ min: 0 }),
];

const idParamValidator = [param('id').isMongoId().withMessage('Invalid participation id')];

module.exports = { createParticipationValidator, idParamValidator };
