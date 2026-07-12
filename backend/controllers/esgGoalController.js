const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ESGGoal = require('../models/ESGGoal');

/**
 * @desc    Create an ESG goal
 * @route   POST /api/esg-goals
 * @access  Private (Admin, Manager)
 */
const createESGGoal = asyncHandler(async (req, res) => {
  const goal = await ESGGoal.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(new ApiResponse(201, goal, 'ESG goal created successfully'));
});

/**
 * @desc    Get all ESG goals (supports ?category= & ?department= & ?status=)
 * @route   GET /api/esg-goals
 * @access  Private
 */
const getESGGoals = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.status) filter.status = req.query.status;

  const goals = await ESGGoal.find(filter)
    .populate('department', 'name code')
    .populate('createdBy', 'name email')
    .sort({ deadline: 1 });

  res.status(200).json(new ApiResponse(200, goals, 'ESG goals fetched successfully'));
});

/**
 * @desc    Get single ESG goal
 * @route   GET /api/esg-goals/:id
 * @access  Private
 */
const getESGGoalById = asyncHandler(async (req, res) => {
  const goal = await ESGGoal.findById(req.params.id)
    .populate('department', 'name code')
    .populate('createdBy', 'name email');
  if (!goal) throw new ApiError(404, 'ESG goal not found');
  res.status(200).json(new ApiResponse(200, goal, 'ESG goal fetched successfully'));
});

/**
 * @desc    Update an ESG goal (progress, status, etc.)
 * @route   PUT /api/esg-goals/:id
 * @access  Private (Admin, Manager)
 */
const updateESGGoal = asyncHandler(async (req, res) => {
  const goal = await ESGGoal.findById(req.params.id);
  if (!goal) throw new ApiError(404, 'ESG goal not found');

  Object.assign(goal, req.body);

  // Auto-update status based on progress vs target
  if (goal.currentValue >= goal.targetValue) {
    goal.status = 'Achieved';
  } else if (new Date() > goal.deadline && goal.status !== 'Achieved') {
    goal.status = 'Missed';
  } else if (goal.currentValue > 0) {
    goal.status = 'In Progress';
  }

  await goal.save();

  res.status(200).json(new ApiResponse(200, goal, 'ESG goal updated successfully'));
});

/**
 * @desc    Delete an ESG goal
 * @route   DELETE /api/esg-goals/:id
 * @access  Private (Admin)
 */
const deleteESGGoal = asyncHandler(async (req, res) => {
  const goal = await ESGGoal.findByIdAndDelete(req.params.id);
  if (!goal) throw new ApiError(404, 'ESG goal not found');
  res.status(200).json(new ApiResponse(200, null, 'ESG goal deleted successfully'));
});

module.exports = { createESGGoal, getESGGoals, getESGGoalById, updateESGGoal, deleteESGGoal };
