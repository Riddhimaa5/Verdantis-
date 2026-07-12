const express = require('express');
const router = express.Router();

const {
  createCarbonTransaction,
  getCarbonTransactions,
  getCarbonTransactionById,
  updateCarbonTransaction,
  deleteCarbonTransaction,
} = require('../controllers/carbonTransactionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createCarbonTransactionValidator,
  idParamValidator,
} = require('../validators/carbonTransactionValidator');

router.use(protect);

router
  .route('/')
  .get(getCarbonTransactions)
  .post(
    authorize('Admin', 'Manager', 'Employee'),
    createCarbonTransactionValidator,
    validate,
    createCarbonTransaction
  );

router
  .route('/:id')
  .get(idParamValidator, validate, getCarbonTransactionById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateCarbonTransaction)
  .delete(authorize('Admin'), idParamValidator, validate, deleteCarbonTransaction);

module.exports = router;
