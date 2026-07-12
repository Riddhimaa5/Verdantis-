const express = require('express');
const router = express.Router();

const {
  createPolicy,
  getPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
} = require('../controllers/policyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createPolicyValidator, idParamValidator } = require('../validators/policyValidator');

router.use(protect);

router
  .route('/')
  .get(getPolicies)
  .post(authorize('Admin', 'Manager'), createPolicyValidator, validate, createPolicy);

router
  .route('/:id')
  .get(idParamValidator, validate, getPolicyById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updatePolicy)
  .delete(authorize('Admin'), idParamValidator, validate, deletePolicy);

module.exports = router;
