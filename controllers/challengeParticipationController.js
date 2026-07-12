const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ChallengeParticipation = require('../models/ChallengeParticipation');
const Challenge = require('../models/Challenge');
const xpService = require('../services/xpService');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Register (join) a challenge - defaults to current user
 * @route   POST /api/challenge-participations
 * @access  Private
 */
const joinChallenge = asyncHandler(async (req, res) => {
  const { challenge, employee } = req.body;

  const challengeDoc = await Challenge.findById(challenge);
  if (!challengeDoc) throw new ApiError(404, 'Challenge not found');

  const targetEmployee = employee || req.user._id;

  const existing = await ChallengeParticipation.findOne({ challenge, employee: targetEmployee });
  if (existing) throw new ApiError(409, 'Already registered for this challenge');

  const participation = await ChallengeParticipation.create({
    challenge,
    employee: targetEmployee,
    status: 'Registered',
  });

  res.status(201).json(new ApiResponse(201, participation, 'Joined challenge successfully'));
});

/**
 * @desc    Get all challenge participations (supports ?employee= & ?challenge=)
 * @route   GET /api/challenge-participations
 * @access  Private
 */
const getChallengeParticipations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.employee) filter.employee = req.query.employee;
  if (req.query.challenge) filter.challenge = req.query.challenge;

  const participations = await ChallengeParticipation.find(filter)
    .populate('employee', 'name email xp points')
    .populate('challenge', 'title xpReward pointsReward status')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, participations, 'Challenge participations fetched successfully'));
});

/**
 * @desc    Update progress/status of a challenge participation. When status
 *          transitions to "Completed", automatically awards XP + points to
 *          the employee and checks for newly unlocked badges.
 * @route   PUT /api/challenge-participations/:id
 * @access  Private
 */
const updateChallengeParticipation = asyncHandler(async (req, res) => {
  const participation = await ChallengeParticipation.findById(req.params.id).populate('challenge');
  if (!participation) throw new ApiError(404, 'Challenge participation not found');

  const wasCompleted = participation.status === 'Completed';

  if (req.body.progress !== undefined) participation.progress = req.body.progress;
  if (req.body.status) participation.status = req.body.status;

  // Auto-complete when progress reaches 100
  if (participation.progress >= 100 && participation.status !== 'Completed') {
    participation.status = 'Completed';
  }

  const justCompleted = !wasCompleted && participation.status === 'Completed';

  if (justCompleted) {
    participation.completedAt = new Date();
    participation.xpAwarded = participation.challenge.xpReward;
    participation.pointsAwarded = participation.challenge.pointsReward;

    // Business rule: Award XP after challenge completion + auto-award badges
    await xpService.awardXP(participation.employee, participation.challenge.xpReward, participation.challenge.pointsReward);

    await createNotification({
      recipient: participation.employee,
      title: 'Challenge Completed!',
      message: `You completed "${participation.challenge.title}" and earned ${participation.challenge.xpReward} XP.`,
      type: 'Challenge',
      relatedId: participation.challenge._id,
    });
  }

  await participation.save();

  res.status(200).json(new ApiResponse(200, participation, 'Challenge participation updated successfully'));
});

/**
 * @desc    Delete a challenge participation
 * @route   DELETE /api/challenge-participations/:id
 * @access  Private (Admin)
 */
const deleteChallengeParticipation = asyncHandler(async (req, res) => {
  const participation = await ChallengeParticipation.findByIdAndDelete(req.params.id);
  if (!participation) throw new ApiError(404, 'Challenge participation not found');
  res.status(200).json(new ApiResponse(200, null, 'Challenge participation deleted successfully'));
});

/**
 * @desc    Get XP leaderboard
 * @route   GET /api/challenge-participations/leaderboard
 * @access  Private
 */
const getLeaderboard = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const leaderboard = await xpService.getLeaderboard(limit);
  res.status(200).json(new ApiResponse(200, leaderboard, 'Leaderboard fetched successfully'));
});

module.exports = {
  joinChallenge,
  getChallengeParticipations,
  updateChallengeParticipation,
  deleteChallengeParticipation,
  getLeaderboard,
};
