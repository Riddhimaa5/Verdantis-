const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Policy = require('../models/Policy');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Create a policy
 * @route   POST /api/policies
 * @access  Private (Admin, Manager)
 */
const createPolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.create({ ...req.body, createdBy: req.user._id });

  if (policy.mandatoryAcknowledgement) {
    await createNotification({
      recipient: null,
      title: 'New Policy Requires Acknowledgement',
      message: `Please review and acknowledge the new policy: "${policy.title}".`,
      type: 'Policy',
      relatedId: policy._id,
    });
  }

  res.status(201).json(new ApiResponse(201, policy, 'Policy created successfully'));
});

/**
 * @desc    Get all policies
 * @route   GET /api/policies
 * @access  Private
 */
const getPolicies = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

  const policies = await Policy.find(filter).populate('createdBy', 'name email').sort({ effectiveDate: -1 });
  res.status(200).json(new ApiResponse(200, policies, 'Policies fetched successfully'));
});

/**
 * @desc    Get single policy
 * @route   GET /api/policies/:id
 * @access  Private
 */
const getPolicyById = asyncHandler(async (req, res) => {
  const policy = await Policy.findById(req.params.id).populate('createdBy', 'name email');
  if (!policy) throw new ApiError(404, 'Policy not found');
  res.status(200).json(new ApiResponse(200, policy, 'Policy fetched successfully'));
});

/**
 * @desc    Update a policy
 * @route   PUT /api/policies/:id
 * @access  Private (Admin, Manager)
 */
const updatePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!policy) throw new ApiError(404, 'Policy not found');
  res.status(200).json(new ApiResponse(200, policy, 'Policy updated successfully'));
});

/**
 * @desc    Delete a policy
 * @route   DELETE /api/policies/:id
 * @access  Private (Admin)
 */
const deletePolicy = asyncHandler(async (req, res) => {
  const policy = await Policy.findByIdAndDelete(req.params.id);
  if (!policy) throw new ApiError(404, 'Policy not found');
  res.status(200).json(new ApiResponse(200, null, 'Policy deleted successfully'));
});

module.exports = { createPolicy, getPolicies, getPolicyById, updatePolicy, deletePolicy };
