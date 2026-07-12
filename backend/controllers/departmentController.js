const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const Department = require('../models/Department');
const DepartmentESGScore = require('../models/DepartmentESGScore');

/**
 * @desc    Create a new department
 * @route   POST /api/departments
 * @access  Private (Admin)
 */
const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, manager, description } = req.body;

  const existing = await Department.findOne({ $or: [{ name }, { code }] });
  if (existing) throw new ApiError(409, 'Department with this name or code already exists');

  const department = await Department.create({ name, code, manager, description });

  // Initialize an ESG score document for the new department
  await DepartmentESGScore.create({ department: department._id });

  res.status(201).json(new ApiResponse(201, department, 'Department created successfully'));
});

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Private
 */
const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find().populate('manager', 'name email role');
  res.status(200).json(new ApiResponse(200, departments, 'Departments fetched successfully'));
});

/**
 * @desc    Get a single department
 * @route   GET /api/departments/:id
 * @access  Private
 */
const getDepartmentById = asyncHandler(async (req, res) => {
  const department = await Department.findById(req.params.id).populate('manager', 'name email role');
  if (!department) throw new ApiError(404, 'Department not found');

  res.status(200).json(new ApiResponse(200, department, 'Department fetched successfully'));
});

/**
 * @desc    Update a department
 * @route   PUT /api/departments/:id
 * @access  Private (Admin)
 */
const updateDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!department) throw new ApiError(404, 'Department not found');

  res.status(200).json(new ApiResponse(200, department, 'Department updated successfully'));
});

/**
 * @desc    Delete a department
 * @route   DELETE /api/departments/:id
 * @access  Private (Admin)
 */
const deleteDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) throw new ApiError(404, 'Department not found');

  await DepartmentESGScore.findOneAndDelete({ department: req.params.id });

  res.status(200).json(new ApiResponse(200, null, 'Department deleted successfully'));
});

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
