const mongoose = require('mongoose');

const carbonTransactionSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department is required'],
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    emissionFactor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'EmissionFactor',
      required: [true, 'Emission factor reference is required'],
    },
    activityType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: 0,
    },
    unit: {
      type: String,
      required: true,
    },
    // Auto-calculated: quantity * emissionFactor.factorValue
    carbonEmission: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

carbonTransactionSchema.index({ department: 1, transactionDate: -1 });

module.exports = mongoose.model('CarbonTransaction', carbonTransactionSchema);
