const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Badge = require('../models/Badge');

/**
 * @desc    Create a badge
 * @route   POST /api/badges
 * @access  Private (Admin)
 */
const createBadge = asyncHandler(async (req, res) => {
  const existing = await Badge.findOne({ name: req.body.name });
  if (existing) throw new ApiError(409, 'A badge with this name already exists');

  const badge = await Badge.create(req.body);
  res.status(201).json(new ApiResponse(201, badge, 'Badge created successfully'));
});

/**
 * @desc    Get all badges
 * @route   GET /api/badges
 * @access  Private
 */
const getBadges = asyncHandler(async (req, res) => {
  const badges = await Badge.find().sort({ xpRequired: 1 });
  res.status(200).json(new ApiResponse(200, badges, 'Badges fetched successfully'));
});

/**
 * @desc    Get single badge
 * @route   GET /api/badges/:id
 * @access  Private
 */
const getBadgeById = asyncHandler(async (req, res) => {
  const badge = await Badge.findById(req.params.id);
  if (!badge) throw new ApiError(404, 'Badge not found');
  res.status(200).json(new ApiResponse(200, badge, 'Badge fetched successfully'));
});

/**
 * @desc    Update a badge
 * @route   PUT /api/badges/:id
 * @access  Private (Admin)
 */
const updateBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!badge) throw new ApiError(404, 'Badge not found');
  res.status(200).json(new ApiResponse(200, badge, 'Badge updated successfully'));
});

/**
 * @desc    Delete a badge
 * @route   DELETE /api/badges/:id
 * @access  Private (Admin)
 */
const deleteBadge = asyncHandler(async (req, res) => {
  const badge = await Badge.findByIdAndDelete(req.params.id);
  if (!badge) throw new ApiError(404, 'Badge not found');
  res.status(200).json(new ApiResponse(200, null, 'Badge deleted successfully'));
});

module.exports = { createBadge, getBadges, getBadgeById, updateBadge, deleteBadge };
