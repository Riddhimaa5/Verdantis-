const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const EmissionFactor = require('../models/EmissionFactor');

/**
 * @desc    Create emission factor
 * @route   POST /api/emission-factors
 * @access  Private (Admin, Manager)
 */
const createEmissionFactor = asyncHandler(async (req, res) => {
  const factor = await EmissionFactor.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(new ApiResponse(201, factor, 'Emission factor created successfully'));
});

/**
 * @desc    Get all emission factors
 * @route   GET /api/emission-factors
 * @access  Private
 */
const getEmissionFactors = asyncHandler(async (req, res) => {
  const factors = await EmissionFactor.find().populate('createdBy', 'name email');
  res.status(200).json(new ApiResponse(200, factors, 'Emission factors fetched successfully'));
});

/**
 * @desc    Get single emission factor
 * @route   GET /api/emission-factors/:id
 * @access  Private
 */
const getEmissionFactorById = asyncHandler(async (req, res) => {
  const factor = await EmissionFactor.findById(req.params.id);
  if (!factor) throw new ApiError(404, 'Emission factor not found');
  res.status(200).json(new ApiResponse(200, factor, 'Emission factor fetched successfully'));
});

/**
 * @desc    Update emission factor
 * @route   PUT /api/emission-factors/:id
 * @access  Private (Admin, Manager)
 */
const updateEmissionFactor = asyncHandler(async (req, res) => {
  const factor = await EmissionFactor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!factor) throw new ApiError(404, 'Emission factor not found');
  res.status(200).json(new ApiResponse(200, factor, 'Emission factor updated successfully'));
});

/**
 * @desc    Delete emission factor
 * @route   DELETE /api/emission-factors/:id
 * @access  Private (Admin)
 */
const deleteEmissionFactor = asyncHandler(async (req, res) => {
  const factor = await EmissionFactor.findByIdAndDelete(req.params.id);
  if (!factor) throw new ApiError(404, 'Emission factor not found');
  res.status(200).json(new ApiResponse(200, null, 'Emission factor deleted successfully'));
});

module.exports = {
  createEmissionFactor,
  getEmissionFactors,
  getEmissionFactorById,
  updateEmissionFactor,
  deleteEmissionFactor,
};
