const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Reward = require('../models/Reward');
const User = require('../models/User');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Create a reward
 * @route   POST /api/rewards
 * @access  Private (Admin, Manager)
 */
const createReward = asyncHandler(async (req, res) => {
  const reward = await Reward.create(req.body);
  res.status(201).json(new ApiResponse(201, reward, 'Reward created successfully'));
});

/**
 * @desc    Get all rewards
 * @route   GET /api/rewards
 * @access  Private
 */
const getRewards = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const rewards = await Reward.find(filter).select('-redemptions').sort({ pointsCost: 1 });
  res.status(200).json(new ApiResponse(200, rewards, 'Rewards fetched successfully'));
});

/**
 * @desc    Get single reward
 * @route   GET /api/rewards/:id
 * @access  Private
 */
const getRewardById = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) throw new ApiError(404, 'Reward not found');
  res.status(200).json(new ApiResponse(200, reward, 'Reward fetched successfully'));
});

/**
 * @desc    Update a reward
 * @route   PUT /api/rewards/:id
 * @access  Private (Admin, Manager)
 */
const updateReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!reward) throw new ApiError(404, 'Reward not found');
  res.status(200).json(new ApiResponse(200, reward, 'Reward updated successfully'));
});

/**
 * @desc    Delete a reward
 * @route   DELETE /api/rewards/:id
 * @access  Private (Admin)
 */
const deleteReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndDelete(req.params.id);
  if (!reward) throw new ApiError(404, 'Reward not found');
  res.status(200).json(new ApiResponse(200, null, 'Reward deleted successfully'));
});

/**
 * @desc    Redeem a reward. Business rule: deducts points from the user
 *          and decreases stock. Fails atomically if either condition
 *          is not satisfiable (insufficient points or out of stock).
 * @route   POST /api/rewards/:id/redeem
 * @access  Private
 */
const redeemReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) throw new ApiError(404, 'Reward not found');
  if (!reward.isActive) throw new ApiError(400, 'This reward is not currently available');
  if (reward.stock <= 0) throw new ApiError(400, 'This reward is out of stock');

  const user = await User.findById(req.user._id);
  if (user.points < reward.pointsCost) {
    throw new ApiError(400, 'Insufficient points to redeem this reward');
  }

  // Deduct points & decrement stock
  user.points -= reward.pointsCost;
  reward.stock -= 1;
  reward.redemptions.push({ user: user._id, pointsSpent: reward.pointsCost });

  await user.save();
  await reward.save();

  await createNotification({
    recipient: user._id,
    title: 'Reward Redeemed',
    message: `You redeemed "${reward.title}" for ${reward.pointsCost} points.`,
    type: 'Reward',
    relatedId: reward._id,
  });

  res.status(200).json(
    new ApiResponse(
      200,
      { reward, remainingPoints: user.points },
      'Reward redeemed successfully'
    )
  );
});

module.exports = {
  createReward,
  getRewards,
  getRewardById,
  updateReward,
  deleteReward,
  redeemReward,
};
