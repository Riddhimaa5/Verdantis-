const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Audit = require('../models/Audit');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Schedule a new audit
 * @route   POST /api/audits
 * @access  Private (Admin, Manager)
 */
const createAudit = asyncHandler(async (req, res) => {
  const audit = await Audit.create({ ...req.body, auditor: req.body.auditor || req.user._id });

  await createNotification({
    recipient: null,
    title: 'Audit Scheduled',
    message: `A new ${audit.auditType} audit "${audit.title}" has been scheduled.`,
    type: 'Audit',
    relatedId: audit._id,
  });

  res.status(201).json(new ApiResponse(201, audit, 'Audit scheduled successfully'));
});

/**
 * @desc    Get all audits (supports ?department= & ?status=)
 * @route   GET /api/audits
 * @access  Private
 */
const getAudits = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;
  if (req.query.status) filter.status = req.query.status;

  const audits = await Audit.find(filter)
    .populate('department', 'name code')
    .populate('auditor', 'name email')
    .sort({ scheduledDate: -1 });

  res.status(200).json(new ApiResponse(200, audits, 'Audits fetched successfully'));
});

/**
 * @desc    Get single audit
 * @route   GET /api/audits/:id
 * @access  Private
 */
const getAuditById = asyncHandler(async (req, res) => {
  const audit = await Audit.findById(req.params.id)
    .populate('department', 'name code')
    .populate('auditor', 'name email');
  if (!audit) throw new ApiError(404, 'Audit not found');
  res.status(200).json(new ApiResponse(200, audit, 'Audit fetched successfully'));
});

/**
 * @desc    Update an audit (e.g. mark completed with findings/score)
 * @route   PUT /api/audits/:id
 * @access  Private (Admin, Manager)
 */
const updateAudit = asyncHandler(async (req, res) => {
  const audit = await Audit.findById(req.params.id);
  if (!audit) throw new ApiError(404, 'Audit not found');

  Object.assign(audit, req.body);

  if (audit.status === 'Completed' && !audit.completedDate) {
    audit.completedDate = new Date();
  }

  await audit.save();

  res.status(200).json(new ApiResponse(200, audit, 'Audit updated successfully'));
});

/**
 * @desc    Delete an audit
 * @route   DELETE /api/audits/:id
 * @access  Private (Admin)
 */
const deleteAudit = asyncHandler(async (req, res) => {
  const audit = await Audit.findByIdAndDelete(req.params.id);
  if (!audit) throw new ApiError(404, 'Audit not found');
  res.status(200).json(new ApiResponse(200, null, 'Audit deleted successfully'));
});

module.exports = { createAudit, getAudits, getAuditById, updateAudit, deleteAudit };
