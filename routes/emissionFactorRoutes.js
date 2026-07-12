const express = require('express');
const router = express.Router();

const {
  createEmissionFactor,
  getEmissionFactors,
  getEmissionFactorById,
  updateEmissionFactor,
  deleteEmissionFactor,
} = require('../controllers/emissionFactorController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createEmissionFactorValidator, idParamValidator } = require('../validators/emissionFactorValidator');

router.use(protect);

router
  .route('/')
  .get(getEmissionFactors)
  .post(authorize('Admin', 'Manager'), createEmissionFactorValidator, validate, createEmissionFactor);

router
  .route('/:id')
  .get(idParamValidator, validate, getEmissionFactorById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateEmissionFactor)
  .delete(authorize('Admin'), idParamValidator, validate, deleteEmissionFactor);

module.exports = router;
