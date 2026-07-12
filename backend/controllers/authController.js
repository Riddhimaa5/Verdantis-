const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, department, designation } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Employee',
    department: department || null,
    designation: designation || '',
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
        },
        token,
      },
      'User registered successfully'
    )
  );
});

/**
 * @desc    Authenticate user & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact your administrator.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.role);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          xp: user.xp,
          points: user.points,
        },
        token,
      },
      'Login successful'
    )
  );
});

/**
 * @desc    Get currently logged-in user's profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('department', 'name code')
    .populate('badges', 'name icon tier');

  res.status(200).json(new ApiResponse(200, user, 'Profile fetched successfully'));
});

module.exports = { register, login, getMe };
