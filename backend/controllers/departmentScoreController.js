const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const DepartmentESGScore = require('../models/DepartmentESGScore');
const scoreService = require('../services/scoreService');

/**
 * @desc    Get ESG scores for all departments
 * @route   GET /api/department-scores
 * @access  Private
 */
const getAllDepartmentScores = asyncHandler(async (req, res) => {
  const scores = await DepartmentESGScore.find().populate('department', 'name code');
  res.status(200).json(new ApiResponse(200, scores, 'Department ESG scores fetched successfully'));
});

/**
 * @desc    Get ESG score for a single department
 * @route   GET /api/department-scores/:departmentId
 * @access  Private
 */
const getDepartmentScore = asyncHandler(async (req, res) => {
  const score = await DepartmentESGScore.findOne({ department: req.params.departmentId }).populate(
    'department',
    'name code'
  );
  if (!score) throw new ApiError(404, 'ESG score not found for this department');
  res.status(200).json(new ApiResponse(200, score, 'Department ESG score fetched successfully'));
});

/**
 * @desc    Force-recalculate ESG scores for a department (manual trigger)
 * @route   POST /api/department-scores/:departmentId/recalculate
 * @access  Private (Admin, Manager)
 */
const recalculateDepartmentScore = asyncHandler(async (req, res) => {
  const score = await scoreService.recalcAllScores(req.params.departmentId);
  res.status(200).json(new ApiResponse(200, score, 'Department ESG score recalculated successfully'));
});

module.exports = { getAllDepartmentScores, getDepartmentScore, recalculateDepartmentScore };
