const express = require('express');
const router = express.Router();

const {
  createParticipation,
  getParticipations,
  updateParticipation,
  deleteParticipation,
} = require('../controllers/participationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createParticipationValidator, idParamValidator } = require('../validators/participationValidator');

router.use(protect);

router
  .route('/')
  .get(getParticipations)
  .post(createParticipationValidator, validate, createParticipation);

router
  .route('/:id')
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateParticipation)
  .delete(authorize('Admin'), idParamValidator, validate, deleteParticipation);

module.exports = router;
