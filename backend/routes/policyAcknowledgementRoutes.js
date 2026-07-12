const express = require('express');
const router = express.Router();

const {
  acknowledgePolicy,
  getAcknowledgements,
  deleteAcknowledgement,
} = require('../controllers/policyAcknowledgementController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createAcknowledgementValidator,
  idParamValidator,
} = require('../validators/policyAcknowledgementValidator');

router.use(protect);

router
  .route('/')
  .get(getAcknowledgements)
  .post(createAcknowledgementValidator, validate, acknowledgePolicy);

router.delete('/:id', authorize('Admin'), idParamValidator, validate, deleteAcknowledgement);

module.exports = router;
