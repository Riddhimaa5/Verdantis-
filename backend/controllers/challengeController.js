const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Challenge = require('../models/Challenge');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Create a challenge
 * @route   POST /api/challenges
 * @access  Private (Admin, Manager)
 */
const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.create({ ...req.body, createdBy: req.user._id });

  await createNotification({
    recipient: null,
    title: 'New Challenge Available!',
    message: `A new challenge "${challenge.title}" is now available. Join and earn ${challenge.xpReward} XP!`,
    type: 'Challenge',
    relatedId: challenge._id,
  });

  res.status(201).json(new ApiResponse(201, challenge, 'Challenge created successfully'));
});

/**
 * @desc    Get all challenges (supports ?status=)
 * @route   GET /api/challenges
 * @access  Private
 */
const getChallenges = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const challenges = await Challenge.find(filter).populate('createdBy', 'name email').sort({ startDate: -1 });
  res.status(200).json(new ApiResponse(200, challenges, 'Challenges fetched successfully'));
});

/**
 * @desc    Get single challenge
 * @route   GET /api/challenges/:id
 * @access  Private
 */
const getChallengeById = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findById(req.params.id).populate('createdBy', 'name email');
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  res.status(200).json(new ApiResponse(200, challenge, 'Challenge fetched successfully'));
});

/**
 * @desc    Update a challenge
 * @route   PUT /api/challenges/:id
 * @access  Private (Admin, Manager)
 */
const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  res.status(200).json(new ApiResponse(200, challenge, 'Challenge updated successfully'));
});

/**
 * @desc    Delete a challenge
 * @route   DELETE /api/challenges/:id
 * @access  Private (Admin)
 */
const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await Challenge.findByIdAndDelete(req.params.id);
  if (!challenge) throw new ApiError(404, 'Challenge not found');
  res.status(200).json(new ApiResponse(200, null, 'Challenge deleted successfully'));
});

module.exports = { createChallenge, getChallenges, getChallengeById, updateChallenge, deleteChallenge };
