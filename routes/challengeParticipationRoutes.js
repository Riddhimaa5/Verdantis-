const express = require('express');
const router = express.Router();

const {
  joinChallenge,
  getChallengeParticipations,
  updateChallengeParticipation,
  deleteChallengeParticipation,
  getLeaderboard,
} = require('../controllers/challengeParticipationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  createChallengeParticipationValidator,
  updateProgressValidator,
  idParamValidator,
} = require('../validators/challengeParticipationValidator');

router.use(protect);

// NOTE: /leaderboard must be declared before /:id routes to avoid being
// matched as a Mongo ObjectId parameter.
router.get('/leaderboard', getLeaderboard);

router
  .route('/')
  .get(getChallengeParticipations)
  .post(createChallengeParticipationValidator, validate, joinChallenge);

router
  .route('/:id')
  .put(updateProgressValidator, validate, updateChallengeParticipation)
  .delete(authorize('Admin'), idParamValidator, validate, deleteChallengeParticipation);

module.exports = router;
