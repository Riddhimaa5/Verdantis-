const express = require('express');
const router = express.Router();

const {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
  redeemReward,
} = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createRewardValidator, idParamValidator } = require('../validators/rewardValidator');

router.use(protect);

router
  .route('/')
  .get(getRewards)
  .post(authorize('Admin', 'Manager'), createRewardValidator, validate, createReward);

router.post('/:id/redeem', idParamValidator, validate, redeemReward);

router
  .route('/:id')
  .get(idParamValidator, validate, getRewardById)
  .put(authorize('Admin', 'Manager'), idParamValidator, validate, updateReward)
  .delete(authorize('Admin'), idParamValidator, validate, deleteReward);

module.exports = router;
