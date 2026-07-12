const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const EmployeeParticipation = require('../models/EmployeeParticipation');
const CSRActivity = require('../models/CSRActivity');
const scoreService = require('../services/scoreService');

/**
 * @desc    Register participation in a CSR activity (defaults to current user)
 * @route   POST /api/participations
 * @access  Private
 */
const createParticipation = asyncHandler(async (req, res) => {
  const { csrActivity, employee, hoursContributed, role } = req.body;

  const activity = await CSRActivity.findById(csrActivity);
  if (!activity) throw new ApiError(404, 'CSR activity not found');

  const participation = await EmployeeParticipation.create({
    employee: employee || req.user._id,
    csrActivity,
    hoursContributed: hoursContributed || 0,
    role: role || 'Volunteer',
  });

  res.status(201).json(new ApiResponse(201, participation, 'Participation recorded successfully'));
});

/**
 * @desc    Get all participations (supports ?employee= & ?csrActivity=)
 * @route   GET /api/participations
 * @access  Private
 */
const getParticipations = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.employee) filter.employee = req.query.employee;
  if (req.query.csrActivity) filter.csrActivity = req.query.csrActivity;

  const participations = await EmployeeParticipation.find(filter)
    .populate('employee', 'name email')
    .populate('csrActivity', 'title department activityDate')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, participations, 'Participations fetched successfully'));
});

/**
 * @desc    Update a participation record (e.g. mark Attended).
 *          Automatically recalculates the department's Social score
 *          when status becomes "Attended".
 * @route   PUT /api/participations/:id
 * @access  Private (Admin, Manager)
 */
const updateParticipation = asyncHandler(async (req, res) => {
  const participation = await EmployeeParticipation.findById(req.params.id).populate('csrActivity');
  if (!participation) throw new ApiError(404, 'Participation not found');

  Object.assign(participation, req.body);
  await participation.save();

  if (participation.status === 'Attended' && participation.csrActivity?.department) {
    await scoreService.recalcSocialScore(participation.csrActivity.department);
  }

  res.status(200).json(new ApiResponse(200, participation, 'Participation updated successfully'));
});

/**
 * @desc    Delete a participation record
 * @route   DELETE /api/participations/:id
 * @access  Private (Admin)
 */
const deleteParticipation = asyncHandler(async (req, res) => {
  const participation = await EmployeeParticipation.findByIdAndDelete(req.params.id);
  if (!participation) throw new ApiError(404, 'Participation not found');
  res.status(200).json(new ApiResponse(200, null, 'Participation deleted successfully'));
});

module.exports = { createParticipation, getParticipations, updateParticipation, deleteParticipation };
