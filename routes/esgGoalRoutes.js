const express = require('express');
const router = express.Router();

const {
  createESGGoal,
  getESGGoals,
  getESGGoalById,
  updateESGGoal,
  deleteESGGoal,
} = require('../controllers/esgGoalController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createESGGoalValidator, idParamValidator } = require('../validators/esgGoalValidator');

router.use(protect);

router
  .route('/')
  .get(getESGGoals)
  .post(authorize('Admin', 'Manager'), createESGGoalValidator, validate, createESGGoal);

router
  .route('/:id')
  .get(idParamValidator, validate, getESGGoalById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateESGGoal)
  .delete(authorize('Admin'), idParamValidator, validate, deleteESGGoal);

module.exports = router;
