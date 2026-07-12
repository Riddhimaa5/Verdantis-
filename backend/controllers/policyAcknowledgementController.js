const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const PolicyAcknowledgement = require('../models/PolicyAcknowledgement');
const Policy = require('../models/Policy');
const User = require('../models/User');
const scoreService = require('../services/scoreService');

/**
 * @desc    Acknowledge a policy (current user, or specified employee by Admin).
 *          Automatically recalculates the Governance score for the
 *          employee's department.
 * @route   POST /api/policy-acknowledgements
 * @access  Private
 */
const acknowledgePolicy = asyncHandler(async (req, res) => {
  const { policy, employee } = req.body;

  const policyDoc = await Policy.findById(policy);
  if (!policyDoc) throw new ApiError(404, 'Policy not found');

  const targetEmployeeId = employee || req.user._id;

  const existing = await PolicyAcknowledgement.findOne({ policy, employee: targetEmployeeId });
  if (existing) throw new ApiError(409, 'Policy already acknowledged by this employee');

  const acknowledgement = await PolicyAcknowledgement.create({
    policy,
    employee: targetEmployeeId,
    ipAddress: req.ip,
  });

  const employeeDoc = await User.findById(targetEmployeeId);
  if (employeeDoc?.department) {
    await scoreService.recalcGovernanceScore(employeeDoc.department);
  }

  res.status(201).json(new ApiResponse(201, acknowledgement, 'Policy acknowledged successfully'));
});

/**
 * @desc    Get all acknowledgements (supports ?policy= & ?employee=)
 * @route   GET /api/policy-acknowledgements
 * @access  Private
 */
const getAcknowledgements = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.policy) filter.policy = req.query.policy;
  if (req.query.employee) filter.employee = req.query.employee;

  const acknowledgements = await PolicyAcknowledgement.find(filter)
    .populate('policy', 'title category version')
    .populate('employee', 'name email')
    .sort({ acknowledgedAt: -1 });

  res.status(200).json(new ApiResponse(200, acknowledgements, 'Acknowledgements fetched successfully'));
});

/**
 * @desc    Delete an acknowledgement (rare, admin correction use case)
 * @route   DELETE /api/policy-acknowledgements/:id
 * @access  Private (Admin)
 */
const deleteAcknowledgement = asyncHandler(async (req, res) => {
  const acknowledgement = await PolicyAcknowledgement.findByIdAndDelete(req.params.id);
  if (!acknowledgement) throw new ApiError(404, 'Acknowledgement not found');
  res.status(200).json(new ApiResponse(200, null, 'Acknowledgement deleted successfully'));
});

module.exports = { acknowledgePolicy, getAcknowledgements, deleteAcknowledgement };
