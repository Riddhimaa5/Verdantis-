const express = require('express');
const router = express.Router();

const {
  createChallenge,
  getChallenges,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createChallengeValidator, idParamValidator } = require('../validators/challengeValidator');

router.use(protect);

router
  .route('/')
  .get(getChallenges)
  .post(authorize('Admin', 'Manager'), createChallengeValidator, validate, createChallenge);

router
  .route('/:id')
  .get(idParamValidator, validate, getChallengeById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateChallenge)
  .delete(authorize('Admin'), idParamValidator, validate, deleteChallenge);

module.exports = router;
