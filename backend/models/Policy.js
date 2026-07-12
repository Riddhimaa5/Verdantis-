const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Policy title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Environmental', 'Social', 'Governance', 'Compliance', 'General'],
      default: 'General',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    version: {
      type: String,
      default: '1.0',
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    mandatoryAcknowledgement: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Policy', policySchema);
