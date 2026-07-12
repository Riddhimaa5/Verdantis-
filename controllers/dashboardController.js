const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');
const Department = require('../models/Department');
const Challenge = require('../models/Challenge');
const Notification = require('../models/Notification');
const scoreService = require('../services/scoreService');
const xpService = require('../services/xpService');

/**
 * @desc    Aggregated ESG dashboard summary for the whole organization.
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    globalScores,
    activeChallenges,
    employeeCount,
    departmentCount,
    leaderboard,
    notifications,
  ] = await Promise.all([
    scoreService.getGlobalESGSummary(),
    Challenge.countDocuments({ status: 'Active' }),
    User.countDocuments({ isActive: true }),
    Department.countDocuments(),
    xpService.getLeaderboard(10),
    Notification.find({
      $or: [{ recipient: req.user._id }, { recipient: null }],
    })
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const dashboard = {
    overallESG: globalScores.overallESG,
    environmentalScore: globalScores.environmentalScore,
    socialScore: globalScores.socialScore,
    governanceScore: globalScores.governanceScore,
    totalCarbonEmission: globalScores.totalCarbonEmission,
    activeChallenges,
    employeeCount,
    departmentCount,
    leaderboard,
    notifications,
  };

  res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard data fetched successfully'));
});

module.exports = { getDashboard };
