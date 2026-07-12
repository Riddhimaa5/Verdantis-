const User = require('../models/User');
const Badge = require('../models/Badge');
const { createNotification } = require('./notificationService');

/**
 * Awards XP and points to a user (e.g. after completing a challenge),
 * then checks whether any new badges have been unlocked.
 */
const awardXP = async (userId, xpAmount = 0, pointsAmount = 0) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.xp += xpAmount;
  user.points += pointsAmount;
  await user.save();

  await checkAndAwardBadges(user);

  return user;
};

/**
 * Checks all badges whose xpRequired threshold has been reached by the user
 * and that the user does not already own, then awards them.
 */
const checkAndAwardBadges = async (user) => {
  const eligibleBadges = await Badge.find({
    xpRequired: { $lte: user.xp },
    _id: { $nin: user.badges },
  });

  if (!eligibleBadges.length) return [];

  user.badges.push(...eligibleBadges.map((b) => b._id));
  await user.save();

  for (const badge of eligibleBadges) {
    await createNotification({
      recipient: user._id,
      title: 'New Badge Unlocked!',
      message: `Congratulations! You've earned the "${badge.name}" badge.`,
      type: 'Badge',
      relatedId: badge._id,
    });
  }

  return eligibleBadges;
};

/**
 * Builds a leaderboard of users sorted by XP descending.
 */
const getLeaderboard = async (limit = 10) => {
  const leaderboard = await User.find({ isActive: true })
    .select('name email xp points role department badges')
    .populate('department', 'name code')
    .populate('badges', 'name icon tier')
    .sort({ xp: -1 })
    .limit(limit);

  return leaderboard;
};

module.exports = { awardXP, checkAndAwardBadges, getLeaderboard };
