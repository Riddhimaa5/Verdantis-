const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const CSRActivity = require('../models/CSRActivity');
const scoreService = require('../services/scoreService');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Create a CSR activity
 * @route   POST /api/csr-activities
 * @access  Private (Admin, Manager)
 */
const createCSRActivity = asyncHandler(async (req, res) => {
  const activity = await CSRActivity.create({ ...req.body, organizedBy: req.user._id });
  res.status(201).json(new ApiResponse(201, activity, 'CSR activity created successfully'));
});

/**
 * @desc    Get all CSR activities (supports ?department= & ?status=)
 * @route   GET /api/csr-activities
 * @access  Private
 */
const getCSRActivities = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.status) filter.status = req.query.status;

  const activities = await CSRActivity.find(filter)
    .populate('department', 'name code')
    .populate('organizedBy', 'name email')
    .sort({ activityDate: -1 });

  res.status(200).json(new ApiResponse(200, activities, 'CSR activities fetched successfully'));
});

/**
 * @desc    Get single CSR activity
 * @route   GET /api/csr-activities/:id
 * @access  Private
 */
const getCSRActivityById = asyncHandler(async (req, res) => {
  const activity = await CSRActivity.findById(req.params.id)
    .populate('department', 'name code')
    .populate('organizedBy', 'name email');
  if (!activity) throw new ApiError(404, 'CSR activity not found');
  res.status(200).json(new ApiResponse(200, activity, 'CSR activity fetched successfully'));
});

/**
 * @desc    Update a CSR activity. If status transitions to Completed,
 *          automatically recalculates the department's Social score.
 * @route   PUT /api/csr-activities/:id
 * @access  Private (Admin, Manager)
 */
const updateCSRActivity = asyncHandler(async (req, res) => {
  const activity = await CSRActivity.findById(req.params.id);
  if (!activity) throw new ApiError(404, 'CSR activity not found');

  const wasCompleted = activity.status === 'Completed';
  Object.assign(activity, req.body);
  await activity.save();

  if (activity.department && (activity.status === 'Completed' || wasCompleted)) {
    await scoreService.recalcSocialScore(activity.department);

    if (!wasCompleted && activity.status === 'Completed') {
      await createNotification({
        recipient: null,
        title: 'CSR Activity Completed',
        message: `"${activity.title}" has been marked as completed.`,
        type: 'CSRActivity',
        relatedId: activity._id,
      });
    }
  }

  res.status(200).json(new ApiResponse(200, activity, 'CSR activity updated successfully'));
});

/**
 * @desc    Delete a CSR activity
 * @route   DELETE /api/csr-activities/:id
 * @access  Private (Admin)
 */
const deleteCSRActivity = asyncHandler(async (req, res) => {
  const activity = await CSRActivity.findByIdAndDelete(req.params.id);
  if (!activity) throw new ApiError(404, 'CSR activity not found');

  if (activity.department) {
    await scoreService.recalcSocialScore(activity.department);
  }

  res.status(200).json(new ApiResponse(200, null, 'CSR activity deleted successfully'));
});

module.exports = {
  createCSRActivity,
  getCSRActivities,
  getCSRActivityById,
  updateCSRActivity,
  deleteCSRActivity,
};
