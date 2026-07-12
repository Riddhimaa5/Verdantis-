const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const ComplianceIssue = require('../models/ComplianceIssue');
const scoreService = require('../services/scoreService');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Report a compliance issue
 * @route   POST /api/compliance-issues
 * @access  Private (Admin, Manager, Employee)
 */
const createComplianceIssue = asyncHandler(async (req, res) => {
  const issue = await ComplianceIssue.create({ ...req.body, reportedBy: req.user._id });

  if (issue.department) {
    await scoreService.recalcGovernanceScore(issue.department);
  }

  await createNotification({
    recipient: null,
    title: 'Compliance Issue Reported',
    message: `A new ${issue.severity} severity compliance issue was reported: "${issue.title}".`,
    type: 'Compliance',
    relatedId: issue._id,
  });

  res.status(201).json(new ApiResponse(201, issue, 'Compliance issue reported successfully'));
});

/**
 * @desc    Get all compliance issues (supports ?department= & ?status= & ?severity=)
 * @route   GET /api/compliance-issues
 * @access  Private
 */
const getComplianceIssues = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.severity) filter.severity = req.query.severity;

  const issues = await ComplianceIssue.find(filter)
    .populate('department', 'name code')
    .populate('reportedBy', 'name email')
    .populate('relatedAudit', 'title')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, issues, 'Compliance issues fetched successfully'));
});

/**
 * @desc    Get single compliance issue
 * @route   GET /api/compliance-issues/:id
 * @access  Private
 */
const getComplianceIssueById = asyncHandler(async (req, res) => {
  const issue = await ComplianceIssue.findById(req.params.id)
    .populate('department', 'name code')
    .populate('reportedBy', 'name email');
  if (!issue) throw new ApiError(404, 'Compliance issue not found');
  res.status(200).json(new ApiResponse(200, issue, 'Compliance issue fetched successfully'));
});

/**
 * @desc    Update a compliance issue. Automatically recalculates the
 *          Governance score when status changes (e.g. to Resolved).
 * @route   PUT /api/compliance-issues/:id
 * @access  Private (Admin, Manager)
 */
const updateComplianceIssue = asyncHandler(async (req, res) => {
  const issue = await ComplianceIssue.findById(req.params.id);
  if (!issue) throw new ApiError(404, 'Compliance issue not found');

  Object.assign(issue, req.body);

  if (issue.status === 'Resolved' && !issue.resolvedAt) {
    issue.resolvedAt = new Date();
  }

  await issue.save();

  if (issue.department) {
    await scoreService.recalcGovernanceScore(issue.department);
  }

  res.status(200).json(new ApiResponse(200, issue, 'Compliance issue updated successfully'));
});

/**
 * @desc    Delete a compliance issue
 * @route   DELETE /api/compliance-issues/:id
 * @access  Private (Admin)
 */
const deleteComplianceIssue = asyncHandler(async (req, res) => {
  const issue = await ComplianceIssue.findByIdAndDelete(req.params.id);
  if (!issue) throw new ApiError(404, 'Compliance issue not found');

  if (issue.department) {
    await scoreService.recalcGovernanceScore(issue.department);
  }

  res.status(200).json(new ApiResponse(200, null, 'Compliance issue deleted successfully'));
});

module.exports = {
  createComplianceIssue,
  getComplianceIssues,
  getComplianceIssueById,
  updateComplianceIssue,
  deleteComplianceIssue,
};
