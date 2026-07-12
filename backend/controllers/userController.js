const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/User');

/**
 * @desc    Get all users (supports ?role= & ?department= filters)
 * @route   GET /api/users
 * @access  Private (Admin, Manager)
 */
const getUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.department) filter.department = req.query.department;

  const users = await User.find(filter)
    .populate('department', 'name code')
    .populate('badges', 'name icon tier')
    .sort({ createdAt: -1 });

  res.status(200).json(new ApiResponse(200, users, 'Users fetched successfully'));
});

/**
 * @desc    Get single user by id
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .populate('department', 'name code')
    .populate('badges', 'name icon tier');

  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
});

/**
 * @desc    Update a user (self or Admin)
 * @route   PUT /api/users/:id
 * @access  Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const isSelf = req.user._id.toString() === req.params.id;
  const isAdmin = req.user.role === 'Admin';

  if (!isSelf && !isAdmin) {
    throw new ApiError(403, 'You are not allowed to update this user');
  }

  const allowedFields = ['name', 'designation'];
  // Only Admins can change role, department & active status
  if (isAdmin) allowedFields.push('role', 'department', 'isActive');

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).populate('department', 'name code');

  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(new ApiResponse(200, user, 'User updated successfully'));
});

/**
 * @desc    Delete (deactivate) a user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

module.exports = { getUsers, getUserById, updateUser, deleteUser };
