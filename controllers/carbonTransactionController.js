const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const CarbonTransaction = require('../models/CarbonTransaction');
const EmissionFactor = require('../models/EmissionFactor');
const scoreService = require('../services/scoreService');
const { createNotification } = require('../services/notificationService');

/**
 * @desc    Create a carbon transaction.
 *          Carbon Emission = Quantity x Emission Factor value.
 *          Automatically triggers Environmental score recalculation for
 *          the department and stores a notification.
 * @route   POST /api/carbon-transactions
 * @access  Private (Admin, Manager, Employee)
 */
const createCarbonTransaction = asyncHandler(async (req, res) => {
  const { department, emissionFactor, quantity, transactionDate, notes } = req.body;

  const factor = await EmissionFactor.findById(emissionFactor);
  if (!factor) throw new ApiError(404, 'Emission factor not found');

  // Core business rule: Carbon Emission = Quantity * Emission Factor
  const carbonEmission = Number(quantity) * Number(factor.factorValue);

  const transaction = await CarbonTransaction.create({
    department,
    recordedBy: req.user._id,
    emissionFactor,
    activityType: factor.activityType,
    quantity,
    unit: factor.unit,
    carbonEmission,
    transactionDate: transactionDate || Date.now(),
    notes,
  });

  // Automatically update the Environmental score (and overall ESG score) for the department
  await scoreService.recalcEnvironmentalScore(department);

  await createNotification({
    recipient: null,
    title: 'New Carbon Transaction Recorded',
    message: `${carbonEmission.toFixed(2)} kg CO2e recorded for activity "${factor.activityType}".`,
    type: 'CarbonTransaction',
    relatedId: transaction._id,
  });

  res.status(201).json(new ApiResponse(201, transaction, 'Carbon transaction recorded successfully'));
});

/**
 * @desc    Get all carbon transactions (supports ?department= filter)
 * @route   GET /api/carbon-transactions
 * @access  Private
 */
const getCarbonTransactions = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.department) filter.department = req.query.department;

  const transactions = await CarbonTransaction.find(filter)
    .populate('department', 'name code')
    .populate('emissionFactor', 'activityType unit factorValue scope')
    .populate('recordedBy', 'name email')
    .sort({ transactionDate: -1 });

  res.status(200).json(new ApiResponse(200, transactions, 'Carbon transactions fetched successfully'));
});

/**
 * @desc    Get a single carbon transaction
 * @route   GET /api/carbon-transactions/:id
 * @access  Private
 */
const getCarbonTransactionById = asyncHandler(async (req, res) => {
  const transaction = await CarbonTransaction.findById(req.params.id)
    .populate('department', 'name code')
    .populate('emissionFactor', 'activityType unit factorValue scope')
    .populate('recordedBy', 'name email');

  if (!transaction) throw new ApiError(404, 'Carbon transaction not found');
  res.status(200).json(new ApiResponse(200, transaction, 'Carbon transaction fetched successfully'));
});

/**
 * @desc    Update a carbon transaction (recalculates emission if quantity/factor changes)
 * @route   PUT /api/carbon-transactions/:id
 * @access  Private (Admin, Manager)
 */
const updateCarbonTransaction = asyncHandler(async (req, res) => {
  const transaction = await CarbonTransaction.findById(req.params.id);
  if (!transaction) throw new ApiError(404, 'Carbon transaction not found');

  const { quantity, emissionFactor } = req.body;
  let factor;

  if (emissionFactor) {
    factor = await EmissionFactor.findById(emissionFactor);
    if (!factor) throw new ApiError(404, 'Emission factor not found');
    transaction.emissionFactor = emissionFactor;
    transaction.activityType = factor.activityType;
    transaction.unit = factor.unit;
  } else {
    factor = await EmissionFactor.findById(transaction.emissionFactor);
  }

  if (quantity !== undefined) transaction.quantity = quantity;

  // Recalculate emission if either quantity or factor changed
  transaction.carbonEmission = Number(transaction.quantity) * Number(factor.factorValue);

  Object.assign(transaction, {
    notes: req.body.notes ?? transaction.notes,
    transactionDate: req.body.transactionDate ?? transaction.transactionDate,
  });

  await transaction.save();

  // Recalculate department environmental score since figures changed
  await scoreService.recalcEnvironmentalScore(transaction.department);

  res.status(200).json(new ApiResponse(200, transaction, 'Carbon transaction updated successfully'));
});

/**
 * @desc    Delete a carbon transaction
 * @route   DELETE /api/carbon-transactions/:id
 * @access  Private (Admin)
 */
const deleteCarbonTransaction = asyncHandler(async (req, res) => {
  const transaction = await CarbonTransaction.findByIdAndDelete(req.params.id);
  if (!transaction) throw new ApiError(404, 'Carbon transaction not found');

  // Recalculate department score after removing the transaction
  await scoreService.recalcEnvironmentalScore(transaction.department);

  res.status(200).json(new ApiResponse(200, null, 'Carbon transaction deleted successfully'));
});

module.exports = {
  createCarbonTransaction,
  getCarbonTransactions,
  getCarbonTransactionById,
  updateCarbonTransaction,
  deleteCarbonTransaction,
};
