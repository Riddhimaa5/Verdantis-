const express = require('express');
const router = express.Router();

const {
  createCSRActivity,
  getCSRActivities,
  getCSRActivityById,
  updateCSRActivity,
  deleteCSRActivity,
} = require('../controllers/csrActivityController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createCSRActivityValidator, idParamValidator } = require('../validators/csrActivityValidator');

router.use(protect);

router
  .route('/')
  .get(getCSRActivities)
  .post(authorize('Admin', 'Manager'), createCSRActivityValidator, validate, createCSRActivity);

router
  .route('/:id')
  .get(idParamValidator, validate, getCSRActivityById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateCSRActivity)
  .delete(authorize('Admin'), idParamValidator, validate, deleteCSRActivity);

module.exports = router;
